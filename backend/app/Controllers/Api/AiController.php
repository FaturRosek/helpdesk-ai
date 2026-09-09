<?php

namespace App\Controllers\Api;

use App\Libraries\AiService;
use App\Libraries\AiToolsService;
use App\Models\AiConversationModel;
use App\Models\AiMessageModel;

class AiController extends BaseApiController
{
    protected AiConversationModel $conversations;
    protected AiMessageModel      $messages;
    protected AiService           $ai;

    public function __construct()
    {
        $this->conversations = new AiConversationModel();
        $this->messages      = new AiMessageModel();
        $this->ai            = new AiService();
    }

    public function getConversations()
    {
        $list = $this->conversations
            ->where('user_id', $this->authUserId())
            ->orderBy('updated_at', 'DESC')
            ->findAll();

        return $this->success($list);
    }

    public function startConversation()
    {
        $data     = $this->request->getJSON(true);
        $ticketId = $data['ticket_id'] ?? null;
        $title    = $data['title'] ?? 'Percakapan Baru';

        $id = $this->conversations->insert([
            'user_id'   => $this->authUserId(),
            'ticket_id' => $ticketId,
            'title'     => $title,
        ]);

        return $this->success($this->conversations->find($id), 'Conversation started', 201);
    }

    public function getMessages($conversationId = null)
    {
        $conv = $this->conversations->find($conversationId);
        if (! $conv) return $this->error('Conversation not found', 404);

        if ((int) $conv['user_id'] !== (int) $this->authUserId() && ! in_array($this->authUserRole(), ['admin', 'agent'], true)) {
            return $this->error('Forbidden', 403);
        }

        return $this->success($this->messages->getHistory((int) $conversationId));
    }

    public function chat($conversationId = null)
    {
        $conv = $this->conversations->find($conversationId);
        if (! $conv) return $this->error('Conversation not found', 404);

        if ((int) $conv['user_id'] !== (int) $this->authUserId() && ! in_array($this->authUserRole(), ['admin', 'agent'], true)) {
            return $this->error('Forbidden', 403);
        }

        $rules = ['message' => 'required'];
        if (! $this->validate($rules)) {
            return $this->error('Validation failed', 422, $this->validator->getErrors());
        }

        $data    = $this->request->getJSON(true);
        $userMsg = trim($data['message']);

        $history = $this->messages->getHistory((int) $conversationId);
        $historyForAi = array_map(fn($m) => [
            'role'    => $m['role'],
            'content' => $m['content'],
        ], $history);

        $authUser    = $this->authUser();
        $toolsService = new AiToolsService($authUser);
        $tools        = $toolsService->getToolDefinitions();

        $result = $this->ai->chat(
            $historyForAi,
            $userMsg,
            $authUser,
            $tools,
            fn(string $name, array $args) => $toolsService->execute($name, $args)
        );

        $aiReply    = $result['reply'];
        $toolCalls  = $result['tool_calls'];

        if (empty($history)) {
            $title = mb_substr($userMsg, 0, 60);
            $this->conversations->update($conversationId, ['title' => $title]);
        }

        $this->messages->insert([
            'conversation_id' => $conversationId,
            'role'            => 'user',
            'content'         => $userMsg,
        ]);

        $metadata = !empty($toolCalls) ? json_encode(['tool_calls' => $toolCalls]) : null;

        $this->messages->insert([
            'conversation_id' => $conversationId,
            'role'            => 'assistant',
            'content'         => $aiReply,
            'metadata'        => $metadata,
        ]);

        return $this->success([
            'user'      => ['role' => 'user',      'content' => $userMsg],
            'assistant' => [
                'role'       => 'assistant',
                'content'    => $aiReply,
                'tool_calls' => $toolCalls,
            ],
        ], 'OK', 201);
    }

    public function deleteConversation($conversationId = null)
    {
        $conv = $this->conversations->find($conversationId);
        if (! $conv) return $this->error('Conversation not found', 404);

        if ((int) $conv['user_id'] !== (int) $this->authUserId()) {
            return $this->error('Forbidden', 403);
        }

        $this->messages->where('conversation_id', $conversationId)->delete();
        $this->conversations->delete($conversationId);

        return $this->success(null, 'Conversation deleted');
    }
}
