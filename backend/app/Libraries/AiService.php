<?php

namespace App\Libraries;

class AiService
{
    private string $apiKey;
    private string $model;
    private string $baseUrl;

    public function __construct()
    {
        $this->apiKey  = env('AI_API_KEY', '');
        $this->model   = env('AI_MODEL', 'qwen/qwen3.8-27b');
        $this->baseUrl = rtrim(env('AI_BASE_URL', 'https://api.groq.com/openai/v1'), '/');
    }

    private function buildSystemPrompt(array $authUser): string
    {
        $role = $authUser['role'];
        $name = $authUser['name'];
        $now  = date('d F Y, H:i');

        $roleContext = match ($role) {
            'customer' => "Kamu sedang berbicara dengan **{$name}** (pelanggan). Bantu mereka menyelesaikan masalah teknis. Jika perlu buat tiket, gunakan tool create_ticket. Selalu cari knowledge base dulu sebelum membuat tiket.",
            'agent'    => "Kamu sedang membantu **{$name}** (agen dukungan). Bantu agen menganalisis tiket, membuat ringkasan, dan memberikan rekomendasi penanganan.",
            'admin'    => "Kamu sedang membantu **{$name}** (admin/superuser). Kamu bisa mengakses semua data, membuat laporan, menganalisis tiket, dan mengubah data jika diminta.",
            default    => "Kamu sedang berbicara dengan **{$name}**.",
        };

        return <<<PROMPT
Kamu adalah **HelpDesk AI**, asisten cerdas sistem helpdesk. Tanggal & waktu sekarang: {$now}.

{$roleContext}

**Instruksi penting:**
- Selalu jawab dalam Bahasa Indonesia yang ramah dan profesional.
- Gunakan tools yang tersedia untuk mengakses data real-time dari sistem.
- Sebelum membuat tiket baru, selalu cari knowledge base terlebih dahulu.
- Jika tidak bisa menyelesaikan masalah, sarankan eskalasi ke agen manusia.
- Saat membuat tiket, klasifikasikan prioritas berdasarkan urgensi:
  - URGENT: sistem down, tidak bisa bekerja sama sekali
  - HIGH: fungsi utama terganggu
  - MEDIUM: masalah tapi masih bisa bekerja
  - LOW: pertanyaan umum, permintaan fitur
- Jangan pernah memberikan data sensitif seperti password.
- Jika user meminta perubahan data, konfirmasi dulu sebelum mengeksekusi tool.
PROMPT;
    }

    public function chat(
        array    $history,
        string   $userMessage,
        array    $authUser,
        array    $tools = [],
        callable $toolExecutor = null,
        string   $extraContext = ''
    ): array {
        if (empty($this->apiKey) || $this->apiKey === 'your-openai-api-key-here') {
            return ['reply' => 'AI belum dikonfigurasi. Silakan set AI_API_KEY di file .env.', 'tool_calls' => []];
        }

        $systemPrompt = $this->buildSystemPrompt($authUser);
        if (!empty($extraContext)) {
            $systemPrompt .= "\n\n" . $extraContext;
        }

        $messages = [['role' => 'system', 'content' => $systemPrompt]];

        foreach ($history as $msg) {
            if (\in_array($msg['role'], ['user', 'assistant'])) {
                $messages[] = ['role' => $msg['role'], 'content' => $msg['content']];
            }
        }
        $messages[] = ['role' => 'user', 'content' => $userMessage];

        $toolCallsLog  = [];
        $maxIterations = 5;

        for ($i = 0; $i < $maxIterations; $i++) {
            $payload = [
                'model'       => $this->model,
                'messages'    => $messages,
                'max_tokens'  => 2048,
                'temperature' => 0.3,
            ];

            if (!empty($tools)) {
                $payload['tools']       = $tools;
                $payload['tool_choice'] = 'auto';
            }

            $response = $this->callApi($payload);

            if (isset($response['error'])) {
                return ['reply' => "Error: {$response['error']}", 'tool_calls' => $toolCallsLog];
            }

            $choice = $response['choices'][0] ?? null;
            if (!$choice) {
                return ['reply' => 'Tidak ada respons dari AI.', 'tool_calls' => $toolCallsLog];
            }

            $message      = $choice['message'];
            $finishReason = $choice['finish_reason'] ?? 'stop';

            if ($finishReason === 'tool_calls' && !empty($message['tool_calls'])) {
                $messages[] = $message;

                foreach ($message['tool_calls'] as $toolCall) {
                    $toolName = $toolCall['function']['name'];
                    $toolArgs = json_decode($toolCall['function']['arguments'], true) ?? [];

                    $toolResult = $toolExecutor ? ($toolExecutor)($toolName, $toolArgs) : ['error' => 'No executor'];

                    $toolCallsLog[] = [
                        'tool'   => $toolName,
                        'args'   => $toolArgs,
                        'result' => $toolResult,
                    ];

                    $messages[] = [
                        'role'         => 'tool',
                        'tool_call_id' => $toolCall['id'],
                        'content'      => json_encode($toolResult, JSON_UNESCAPED_UNICODE),
                    ];
                }

                continue;
            }

            return ['reply' => $message['content'] ?? 'Tidak ada respons dari AI.', 'tool_calls' => $toolCallsLog];
        }

        return ['reply' => 'Terlalu banyak iterasi tool call. Silakan coba lagi.', 'tool_calls' => $toolCallsLog];
    }

    private function callApi(array $payload): array
    {
        $ch = curl_init("{$this->baseUrl}/chat/completions");
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($payload),
            CURLOPT_HTTPHEADER     => [
                'Content-Type: application/json',
                "Authorization: Bearer {$this->apiKey}",
            ],
            CURLOPT_TIMEOUT        => 60,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($response === false) {
            return ['error' => 'Gagal menghubungi AI provider (network error).'];
        }

        $decoded = json_decode($response, true);

        if ($httpCode !== 200) {
            return ['error' => $decoded['error']['message'] ?? "HTTP {$httpCode}"];
        }

        return $decoded;
    }
}
