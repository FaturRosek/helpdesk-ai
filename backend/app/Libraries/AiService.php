<?php

namespace App\Libraries;

class AiService
{
    private string $apiKey;
    private string $model;
    private string $baseUrl;

    private string $systemPrompt = <<<PROMPT
Kamu adalah asisten helpdesk AI yang membantu pengguna menyelesaikan masalah teknis dan pertanyaan seputar layanan.
Jawab dengan ramah, ringkas, dan profesional dalam Bahasa Indonesia.
Jika pertanyaan di luar konteks helpdesk, arahkan pengguna untuk membuat tiket dukungan.
PROMPT;

    public function __construct()
    {
        $this->apiKey  = env('AI_API_KEY', '');
        $this->model   = env('AI_MODEL', 'gpt-3.5-turbo');
        $this->baseUrl = rtrim(env('AI_BASE_URL', 'https://api.openai.com/v1'), '/');
    }

    public function chat(array $history, string $userMessage): string
    {
        if (empty($this->apiKey) || $this->apiKey === 'your-openai-api-key-here') {
            return 'AI belum dikonfigurasi. Silakan set AI_API_KEY di file .env.';
        }

        $messages = [['role' => 'system', 'content' => $this->systemPrompt]];

        foreach ($history as $msg) {
            $messages[] = ['role' => $msg['role'], 'content' => $msg['content']];
        }

        $messages[] = ['role' => 'user', 'content' => $userMessage];

        $payload = json_encode([
            'model'       => $this->model,
            'messages'    => $messages,
            'max_tokens'  => 1024,
            'temperature' => 0.7,
        ]);

        $ch = curl_init("{$this->baseUrl}/chat/completions");
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $payload,
            CURLOPT_HTTPHEADER     => [
                'Content-Type: application/json',
                "Authorization: Bearer {$this->apiKey}",
            ],
            CURLOPT_TIMEOUT        => 30,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($response === false || $httpCode !== 200) {
            $decoded = json_decode($response, true);
            $errMsg  = $decoded['error']['message'] ?? 'Gagal menghubungi AI provider.';
            return "Error: {$errMsg}";
        }

        $data = json_decode($response, true);
        return $data['choices'][0]['message']['content'] ?? 'Tidak ada respons dari AI.';
    }

    public function setSystemPrompt(string $prompt): void
    {
        $this->systemPrompt = $prompt;
    }
}
