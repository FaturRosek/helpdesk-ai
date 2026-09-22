<?php

namespace App\Controllers\Api;

use App\Models\DocumentModel;
use App\Models\DocumentChunkModel;
use App\Libraries\RagService;

class DocumentController extends BaseApiController
{
    protected DocumentModel $documents;
    protected DocumentChunkModel $chunks;
    protected RagService $rag;

    public function __construct()
    {
        $this->documents = new DocumentModel();
        $this->chunks    = new DocumentChunkModel();
        $this->rag       = new RagService();
    }

    public function index()
    {
        $docs = $this->documents->orderBy('created_at', 'DESC')->findAll();
        $result = [];
        foreach ($docs as $doc) {
            $chunkCount = $this->chunks->where('document_id', $doc['id'])->countAllResults();
            $doc['chunk_count'] = $chunkCount;
            $result[] = $doc;
        }
        return $this->success($result);
    }

    public function upload()
    {
        $file = $this->request->getFile('file');
        if (!$file || !$file->isValid()) {
            return $this->error('File tidak valid atau tidak ditemukan', 422);
        }

        $allowedMimes = [
            'text/plain',
            'text/markdown',
            'text/csv',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        $mimeType = $file->getMimeType();
        $fileName = $file->getClientName();
        $size     = $file->getSize();

        $newName = $file->getRandomName();
        $targetDir = WRITEPATH . 'uploads/documents';
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        $file->move($targetDir, $newName);

        $docId = $this->documents->insert([
            'file_name'   => $fileName,
            'file_path'   => 'documents/' . $newName,
            'mime_type'   => $mimeType,
            'size_bytes'  => $size,
            'status'      => 'UPLOADED',
            'uploaded_by' => $this->authUserId(),
        ]);

        $processResult = $this->rag->processDocument($docId);

        $fresh = $this->documents->find($docId);
        $fresh['chunk_count'] = $processResult['total_chunks'] ?? 0;

        return $this->success($fresh, 'Dokumen berhasil diupload dan diproses', 201);
    }

    public function process($id = null)
    {
        $doc = $this->documents->find($id);
        if (!$doc) {
            return $this->error('Dokumen tidak ditemukan', 404);
        }

        $res = $this->rag->processDocument((int)$id);
        if (!$res['success']) {
            return $this->error($res['error'] ?? 'Gagal memproses dokumen', 500);
        }

        $doc = $this->documents->find($id);
        $doc['chunk_count'] = $res['total_chunks'] ?? 0;
        return $this->success($doc, 'Dokumen berhasil diproses ulang');
    }

    public function search()
    {
        $query = $this->request->getGet('q') ?? '';
        if (empty(trim($query))) {
            return $this->success([], 'Query pencarian kosong');
        }

        $results = $this->rag->searchRelevantChunks($query, 6);
        return $this->success($results);
    }

    public function delete($id = null)
    {
        $doc = $this->documents->find($id);
        if (!$doc) {
            return $this->error('Dokumen tidak ditemukan', 404);
        }

        $filePath = WRITEPATH . 'uploads/' . $doc['file_path'];
        if (file_exists($filePath)) {
            @unlink($filePath);
        }

        $this->chunks->where('document_id', $id)->delete();
        $this->documents->delete($id);

        return $this->success(null, 'Dokumen berhasil dihapus');
    }
}
