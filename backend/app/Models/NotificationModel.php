<?php

namespace App\Models;

use CodeIgniter\Model;

class NotificationModel extends Model
{
    protected $table         = 'notifications';
    protected $primaryKey    = 'id';
    protected $allowedFields = [
        'user_id',
        'type',
        'title',
        'body',
        'link',
        'is_read',
        'created_at',
    ];
    protected $useTimestamps = false;

    public function getUnreadCount(int $userId): int
    {
        return $this->where('user_id', $userId)
            ->where('is_read', 0)
            ->countAllResults();
    }

    public function getForUser(int $userId, int $limit = 20): array
    {
        return $this->where('user_id', $userId)
            ->orderBy('id', 'DESC')
            ->limit($limit)
            ->findAll();
    }

    public function markAllAsRead(int $userId): bool
    {
        return $this->where('user_id', $userId)
            ->set(['is_read' => 1])
            ->update();
    }
}
