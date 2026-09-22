<?php

namespace App\Libraries;

use App\Models\DocumentModel;
use App\Models\DocumentChunkModel;

class RagService
{
    private DocumentModel $documentModel;
    private DocumentChunkModel $chunkModel;

    public function __construct()
    {
        $this->documentModel = new DocumentModel();
        $this->chunkModel    = new DocumentChunkModel();
    }

    public function cleanText(string $text): string
    {
        $text = preg_replace('/[^\P{C}\n\t]+/u', '', $text);
        $text = preg_replace('/[ \t]+/', ' ', $text);
        $text = preg_replace('/\n{3,}/', "\n\n", $text);
        return trim($text);
    }

    public function extractText(string $filePath, string $mimeType): string
    {
        if (!file_exists($filePath)) {
            return '';
        }

        $raw = file_get_contents($filePath);
        if ($raw === false) {
            return '';
        }

        if (str_contains($mimeType, 'pdf')) {
            $cleaned = preg_replace('/[^a-zA-Z0-9\s.,!?:;\-\/]/', ' ', $raw);
            return $this->cleanText($cleaned);
        }

        return $this->cleanText($raw);
    }

    public function createChunks(string $text, int $chunkSize = 600, int $overlap = 100): array
    {
        $text = $this->cleanText($text);
        if (empty($text)) {
            return [];
        }

        $paragraphs = explode("\n\n", $text);
        $chunks = [];
        $currentChunk = '';

        foreach ($paragraphs as $para) {
            $para = trim($para);
            if (empty($para)) {
                continue;
            }

            if (mb_strlen($currentChunk . ' ' . $para) <= $chunkSize) {
                $currentChunk = empty($currentChunk) ? $para : $currentChunk . "\n\n" . $para;
            } else {
                if (!empty($currentChunk)) {
                    $chunks[] = $currentChunk;
                }
                $currentChunk = $para;
            }
        }

        if (!empty($currentChunk)) {
            $chunks[] = $currentChunk;
        }

        return $chunks;
    }

    public function processDocument(int $documentId): array
    {
        $doc = $this->documentModel->find($documentId);
        if (!$doc) {
            return ['success' => false, 'error' => 'Dokumen tidak ditemukan'];
        }

        $filePath = WRITEPATH . 'uploads/' . $doc['file_path'];
        if (!file_exists($filePath)) {
            $filePath = $doc['file_path'];
        }

        $text = $this->extractText($filePath, $doc['mime_type']);
        if (empty($text)) {
            $this->documentModel->update($documentId, [
                'status' => 'FAILED',
                'error_message' => 'Gagal mengekstrak teks dari file'
            ]);
            return ['success' => false, 'error' => 'Gagal mengekstrak teks'];
        }

        $chunks = $this->createChunks($text);
        $this->chunkModel->where('document_id', $documentId)->delete();

        $saved = 0;
        foreach ($chunks as $index => $chunkText) {
            $this->chunkModel->insert([
                'document_id' => $documentId,
                'chunk_index' => $index,
                'content'     => $chunkText,
                'metadata'    => json_encode(['file_name' => $doc['file_name'], 'length' => mb_strlen($chunkText)]),
                'created_at'  => date('Y-m-d H:i:s'),
            ]);
            $saved++;
        }

        $this->documentModel->update($documentId, [
            'status'        => 'PROCESSED',
            'error_message' => null
        ]);

        return [
            'success'      => true,
            'total_chunks' => $saved,
        ];
    }

    public function searchRelevantChunks(string $query, int $limit = 4): array
    {
        $keywords = array_filter(explode(' ', mb_strtolower(trim($query))), fn($k) => mb_strlen($k) > 2);
        if (empty($keywords)) {
            return [];
        }

        $db = $this->chunkModel->db;
        $builder = $db->table('document_chunks')
            ->select('document_chunks.*, documents.file_name')
            ->join('documents', 'documents.id = document_chunks.document_id', 'inner')
            ->where('documents.status', 'PROCESSED');

        $builder->groupStart();
        foreach ($keywords as $kw) {
            $builder->orLike('LOWER(document_chunks.content)', $kw);
        }
        $builder->groupEnd();

        $results = $builder->limit($limit * 3)->get()->getResultArray();

        $scored = [];
        foreach ($results as $item) {
            $score = 0;
            $lower = mb_strtolower($item['content']);
            foreach ($keywords as $kw) {
                if (str_contains($lower, $kw)) {
                    $score += substr_count($lower, $kw);
                }
            }
            $item['score'] = $score;
            $scored[] = $item;
        }

        usort($scored, fn($a, $b) => $b['score'] <=> $a['score']);
        $final = array_slice($scored, 0, $limit);

        return array_map(fn($item) => [
            'chunk_id'    => $item['id'],
            'document_id' => $item['document_id'],
            'file_name'   => $item['file_name'],
            'chunk_index' => $item['chunk_index'],
            'content'     => $item['content'],
            'score'       => $item['score'],
        ], $final);
    }

    public function buildRagContext(string $query): array
    {
        $chunks = $this->searchRelevantChunks($query);
        if (empty($chunks)) {
            return [
                'has_context' => false,
                'prompt_text' => '',
                'sources'     => [],
            ];
        }

        $contextLines = [];
        $sources = [];
        foreach ($chunks as $c) {
            $contextLines[] = "[Dokumen: {$c['file_name']} - Bagian #{$c['chunk_index']}]:\n{$c['content']}";
            $sources[] = [
                'file_name'   => $c['file_name'],
                'chunk_index' => $c['chunk_index'],
                'excerpt'     => mb_substr($c['content'], 0, 150) . '...',
            ];
        }

        $promptText = "INFORMASI DARI BASIS PENGETAHUAN & DOKUMEN SISTEM:\n" . implode("\n\n", $contextLines);

        return [
            'has_context' => true,
            'prompt_text' => $promptText,
            'sources'     => $sources,
        ];
    }
}
