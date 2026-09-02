<?php

namespace App\Models;

use CodeIgniter\Model;

class AgentModel extends Model
{
    protected $table         = 'agents';
    protected $primaryKey    = 'id';
    protected $allowedFields = ['user_id', 'department', 'max_active_tickets'];
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
}
