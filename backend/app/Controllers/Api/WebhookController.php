<?php

namespace App\Controllers\Api;

use App\Libraries\AiService;
use App\Libraries\AiToolsService;
use App\Models\UserModel;

class WebhookController extends BaseApiController
{
    public function chat()
    {
        $data = $this->request->getJSON(true);

        $message = trim($data['message'] ?? '');
        if (empty($message)) {
            return $this->error('Field "message" wajib diisi.', 422);
        }

        $userContext = $data['user_context'] ?? [];
        $role        = $userContext['role']  ?? 'agent';
        $userId      = $userContext['user_id'] ?? null;
        $userName    = $userContext['name']   ?? 'n8n Automation';
        $userEmail   = $userContext['email']  ?? 'n8n@system.local';

        if (!\in_array($role, ['admin', 'agent', 'customer'])) {
            return $this->error('role harus salah satu dari: admin, agent, customer.', 422);
        }

        if ($userId && \in_array($role, ['admin', 'agent', 'customer'])) {
            $userModel = new UserModel();
            $dbUser    = $userModel->find((int)$userId);
            if ($dbUser) {
                $userName  = $dbUser['name'];
                $userEmail = $dbUser['email'];
                $role      = $dbUser['role'];
            }
        }

        $authUser = [
            'id'    => $userId ? (int)$userId : 0,
            'role'  => $role,
            'name'  => $userName,
            'email' => $userEmail,
        ];

        $history = [];
        if (!empty($data['history']) && \is_array($data['history'])) {
            foreach ($data['history'] as $msg) {
                if (isset($msg['role'], $msg['content'])) {
                    $history[] = ['role' => $msg['role'], 'content' => $msg['content']];
                }
            }
        }

        $toolsService = new AiToolsService($authUser);
        $tools        = $toolsService->getToolDefinitions();
        $ai           = new AiService();

        $result = $ai->chat(
            $history,
            $message,
            $authUser,
            $tools,
            fn(string $name, array $args) => $toolsService->execute($name, $args)
        );

        return $this->success([
            'reply'      => $result['reply'],
            'tool_calls' => $result['tool_calls'],
            'user'       => [
                'id'    => $authUser['id'],
                'role'  => $authUser['role'],
                'name'  => $authUser['name'],
            ],
        ]);
    }
}
