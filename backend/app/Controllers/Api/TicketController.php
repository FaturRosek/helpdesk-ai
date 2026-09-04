<?php

namespace App\Controllers\Api;

use App\Models\TicketModel;
use App\Models\TicketMessageModel;
use App\Models\TicketStatusHistoryModel;
use App\Models\CustomerModel;

class TicketController extends BaseApiController
{
    protected TicketModel $tickets;
    protected TicketMessageModel $messages;
    protected TicketStatusHistoryModel $histories;

    public function __construct()
    {
        $this->tickets   = new TicketModel();
        $this->messages  = new TicketMessageModel();
        $this->histories = new TicketStatusHistoryModel();
    }

    public function create()
    {
        $rules = [
            'subject'     => 'required|max_length[200]',
            'description' => 'required',
            'category_id' => 'permit_empty|integer',
            'priority'    => 'permit_empty|in_list[LOW,MEDIUM,HIGH,URGENT]',
        ];
        if (! $this->validate($rules)) {
            return $this->error('Validation failed', 422, $this->validator->getErrors());
        }

        $customerModel = new CustomerModel();
        $customer = $customerModel->where('user_id', $this->authUserId())->first();
        if (! $customer) {
            return $this->error('Only customers can create tickets', 403);
        }

        $data = $this->request->getJSON(true);

        $id = $this->tickets->insert([
            'ticket_number' => $this->tickets->generateTicketNumber(),
            'customer_id'   => $customer['id'],
            'category_id'   => $data['category_id'] ?? null,
            'subject'       => $data['subject'],
            'description'   => $data['description'],
            'priority'      => $data['priority'] ?? 'MEDIUM',
            'status'        => 'OPEN',
        ]);

        $this->histories->insert([
            'ticket_id' => $id,
            'from_status' => null,
            'to_status' => 'OPEN',
            'changed_by' => $this->authUserId(),
        ]);

        return $this->success($this->tickets->find($id), 'Ticket created', 201);
    }

    public function index()
    {
        $builder = $this->tickets;
        $role = $this->authUserRole();

        if ($role === 'customer') {
            $customerModel = new CustomerModel();
            $customer = $customerModel->where('user_id', $this->authUserId())->first();
            $builder = $builder->where('customer_id', $customer['id'] ?? 0);
        } elseif ($role === 'agent') {
            $builder = $builder->where('agent_id', $this->authUserId());
        }

        return $this->success($builder->findAll());
    }
    public function show($id = null)
    {
        $ticket = $this->tickets->find($id);
        if (! $ticket) return $this->error('Ticket not found', 404);
        return $this->success($ticket);
    }

    public function update($id = null)
    {
        if (! $this->tickets->find($id)) return $this->error('Ticket not found', 404);
        $data = $this->request->getJSON(true);
        $allowed = array_intersect_key($data, array_flip(['subject', 'description', 'priority', 'category_id']));
        $this->tickets->update($id, $allowed);
        return $this->success($this->tickets->find($id), 'Ticket updated');
    }

    public function assign($id = null)
    {
        $ticket = $this->tickets->find($id);
        if (! $ticket) return $this->error('Ticket not found', 404);

        $data = $this->request->getJSON(true);
        $this->tickets->update($id, ['agent_id' => $data['agent_id'], 'status' => 'IN_PROGRESS']);

        $this->histories->insert([
            'ticket_id' => $id,
            'from_status' => $ticket['status'],
            'to_status' => 'IN_PROGRESS',
            'changed_by' => $this->authUserId(),
            'note' => 'Assigned to agent',
        ]);

        return $this->success($this->tickets->find($id), 'Ticket assigned');
    }

    public function reply($id = null)
    {
        $ticket = $this->tickets->find($id);
        if (! $ticket) return $this->error('Ticket not found', 404);
        if ($ticket['status'] === 'CLOSED') {
            return $this->error('Cannot reply to a closed ticket', 403);
        }

        $rules = ['message' => 'required'];
        if (! $this->validate($rules)) {
            return $this->error('Validation failed', 422, $this->validator->getErrors());
        }

        $data = $this->request->getJSON(true);
        $role = $this->authUserRole();
        $isInternal = ($data['is_internal'] ?? false) && in_array($role, ['agent', 'admin'], true);

        $msgId = $this->messages->insert([
            'ticket_id'   => $id,
            'sender_id'   => $this->authUserId(),
            'message'     => $data['message'],
            'is_internal' => $isInternal ? 1 : 0,
        ]);

        return $this->success($this->messages->find($msgId), 'Message sent', 201);
    }

    public function messages($id = null)
    {
        $query = $this->messages->where('ticket_id', $id);

        if (! in_array($this->authUserRole(), ['agent', 'admin'], true)) {
            $query = $query->where('is_internal', 0);
        }

        return $this->success($query->orderBy('created_at', 'ASC')->findAll());
    }

    private function changeStatus($id, string $newStatus, ?string $note = null)
    {
        $ticket = $this->tickets->find($id);
        if (! $ticket) return $this->error('Ticket not found', 404);

        $extra = [];
        if ($newStatus === 'RESOLVED') $extra['resolved_at'] = date('Y-m-d H:i:s');
        if ($newStatus === 'CLOSED')   $extra['closed_at']   = date('Y-m-d H:i:s');

        $this->tickets->update($id, array_merge(['status' => $newStatus], $extra));

        $this->histories->insert([
            'ticket_id' => $id,
            'from_status' => $ticket['status'],
            'to_status' => $newStatus,
            'changed_by' => $this->authUserId(),
            'note' => $note,
        ]);

        return $this->success($this->tickets->find($id), "Ticket set to $newStatus");
    }

    public function resolve($id = null)
    {
        return $this->changeStatus($id, 'RESOLVED');
    }
    public function close($id = null)
    {
        return $this->changeStatus($id, 'CLOSED');
    }

    public function reopen($id = null)
    {
        $ticket = $this->tickets->find($id);
        if (! $ticket) return $this->error('Ticket not found', 404);
        if ($ticket['status'] !== 'RESOLVED') {
            return $this->error('Only resolved tickets can be reopened', 403);
        }
        return $this->changeStatus($id, 'OPEN', 'Reopened by ' . $this->authUserRole());
    }

    public function history($id = null)
    {
        return $this->success(
            $this->histories->where('ticket_id', $id)->orderBy('created_at', 'ASC')->findAll()
        );
    }
}
