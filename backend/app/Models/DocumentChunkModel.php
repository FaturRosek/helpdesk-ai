<?php

namespace App\Models;

use CodeIgniter\Model;

class DocumentChunkModel extends Model
{
    protected $table         = 'document_chunks';
    protected $primaryKey    = 'id';
    protected $allowedFields = [
        'document_id',
        'chunk_index',
        'content',
        'metadata',
        'embedding',
        'created_at',
    ];
    protected $useTimestamps = false;
}
