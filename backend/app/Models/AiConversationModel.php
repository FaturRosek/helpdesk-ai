<?php

namespace App\Models;

use CodeIgniter\Model;

class AiConversationModel extends Model
{
    protected $table      = 'ai_conversations';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields = ['user_id', 'ticket_id', 'title'];
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
}
