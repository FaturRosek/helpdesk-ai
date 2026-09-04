<?php

namespace App\Models;

use CodeIgniter\Model;

class TicketStatusHistoryModel extends Model
{
    protected $table         = 'ticket_status_histories';
    protected $primaryKey    = 'id';
    protected $allowedFields = ['ticket_id', 'from_status', 'to_status', 'changed_by', 'note'];
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = '';
}
