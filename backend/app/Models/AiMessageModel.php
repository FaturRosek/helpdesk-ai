<?php

namespace App\Models;

use CodeIgniter\Model;

class AiMessageModel extends Model
{
    protected $table      = 'ai_messages';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields = ['conversation_id', 'role', 'content', 'metadata'];
    protected $useTimestamps = true;
    protected $updatedField  = '';
    protected $createdField  = 'created_at';

    public function getHistory(int $conversationId): array
    {
        return $this
            ->where('conversation_id', $conversationId)
            ->orderBy('created_at', 'ASC')
            ->findAll();
    }
}
