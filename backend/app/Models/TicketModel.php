<?php

namespace App\Models;

use CodeIgniter\Model;

class TicketModel extends Model
{
    protected $table         = 'tickets';
    protected $primaryKey    = 'id';
    protected $allowedFields = [
        'ticket_number',
        'customer_id',
        'agent_id',
        'category_id',
        'subject',
        'description',
        'priority',
        'status',
        'sla_due_at',
        'resolved_at',
        'closed_at',
    ];
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    public function generateTicketNumber(): string
    {
        return 'TKT-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
    }
}
