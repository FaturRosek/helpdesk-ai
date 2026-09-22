<?php

namespace App\Models;

use CodeIgniter\Model;

class DocumentModel extends Model
{
    protected $table         = 'documents';
    protected $primaryKey    = 'id';
    protected $allowedFields = [
        'file_name',
        'file_path',
        'mime_type',
        'size_bytes',
        'status',
        'error_message',
        'uploaded_by',
    ];
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
}
