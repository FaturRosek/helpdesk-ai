<?php

namespace App\Controllers\Api;

use App\Models\NotificationModel;

class NotificationController extends BaseApiController
{
    protected NotificationModel $notifications;

    public function __construct()
    {
        $this->notifications = new NotificationModel();
    }

    public function index()
    {
        $userId = $this->authUserId();
        $list   = $this->notifications->getForUser($userId, 30);
        $unread = $this->notifications->getUnreadCount($userId);

        return $this->success([
            'notifications' => $list,
            'unread_count'  => $unread,
        ]);
    }

    public function unreadCount()
    {
        $userId = $this->authUserId();
        $unread = $this->notifications->getUnreadCount($userId);
        return $this->success(['unread_count' => $unread]);
    }

    public function markAsRead($id = null)
    {
        $userId = $this->authUserId();
        $notif  = $this->notifications->find($id);
        if (!$notif || (int)$notif['user_id'] !== (int)$userId) {
            return $this->error('Notifikasi tidak ditemukan', 404);
        }

        $this->notifications->update($id, ['is_read' => 1]);
        return $this->success(null, 'Notifikasi telah dibaca');
    }

    public function markAllAsRead()
    {
        $userId = $this->authUserId();
        $this->notifications->markAllAsRead($userId);
        return $this->success(null, 'Semua notifikasi telah ditandai dibaca');
    }
}
