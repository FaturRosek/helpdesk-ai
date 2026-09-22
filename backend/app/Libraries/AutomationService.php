<?php

namespace App\Libraries;

use App\Models\TicketModel;
use App\Models\TicketStatusHistoryModel;
use App\Models\NotificationModel;
use App\Models\AgentModel;
use App\Models\UserModel;

class AutomationService
{
    private TicketModel $ticketModel;
    private TicketStatusHistoryModel $historyModel;
    private NotificationModel $notificationModel;
    private AgentModel $agentModel;
    private UserModel $userModel;

    public function __construct()
    {
        $this->ticketModel       = new TicketModel();
        $this->historyModel      = new TicketStatusHistoryModel();
        $this->notificationModel = new NotificationModel();
        $this->agentModel        = new AgentModel();
        $this->userModel         = new UserModel();
    }

    public function getSlaHours(string $priority): int
    {
        return match (strtoupper($priority)) {
            'URGENT' => 2,
            'HIGH'   => 8,
            'MEDIUM' => 24,
            'LOW'    => 48,
            default  => 24,
        };
    }

    public function calculateSlaTarget(string $createdAt, string $priority): string
    {
        $hours = $this->getSlaHours($priority);
        $time = strtotime($createdAt);
        return date('Y-m-d H:i:s', $time + ($hours * 3600));
    }

    public function checkSla(array $ticket): array
    {
        $createdAt = $ticket['created_at'];
        $priority  = $ticket['priority'] ?? 'MEDIUM';
        $slaHours  = $this->getSlaHours($priority);
        $targetTs  = strtotime($createdAt) + ($slaHours * 3600);
        $resolvedTs = !empty($ticket['resolved_at']) ? strtotime($ticket['resolved_at']) : (!empty($ticket['closed_at']) ? strtotime($ticket['closed_at']) : null);
        $compareTs = $resolvedTs ?? time();

        $diffSeconds = $targetTs - $compareTs;
        $diffHours   = round($diffSeconds / 3600, 1);
        $isBreached  = $compareTs > $targetTs;

        $totalSeconds = $slaHours * 3600;
        $elapsedSeconds = $compareTs - strtotime($createdAt);
        $progressPct = min(100, max(0, round(($elapsedSeconds / $totalSeconds) * 100)));

        return [
            'sla_hours'       => $slaHours,
            'target_at'       => date('Y-m-d H:i:s', $targetTs),
            'remaining_hours' => $diffHours,
            'is_breached'     => $isBreached,
            'progress_pct'    => $progressPct,
        ];
    }

    public function autoAssignTickets(): array
    {
        $unassigned = $this->ticketModel
            ->where('agent_id IS NULL', null, false)
            ->whereIn('status', ['OPEN'])
            ->orderBy('created_at', 'ASC')
            ->findAll();

        if (empty($unassigned)) {
            return ['assigned_count' => 0, 'tickets' => []];
        }

        $agents = $this->agentModel
            ->join('users', 'users.id = agents.user_id')
            ->where('users.is_active', 1)
            ->findAll();

        if (empty($agents)) {
            return ['assigned_count' => 0, 'tickets' => [], 'message' => 'Tidak ada agen aktif'];
        }

        $agentWorkloads = [];
        foreach ($agents as $ag) {
            $agentId = (int)$ag['user_id'];
            $activeCount = $this->ticketModel
                ->where('agent_id', $agentId)
                ->whereIn('status', ['OPEN', 'IN_PROGRESS'])
                ->countAllResults();
            $agentWorkloads[$agentId] = $activeCount;
        }

        $assignedList = [];

        foreach ($unassigned as $t) {
            asort($agentWorkloads);
            $selectedAgentId = array_key_first($agentWorkloads);

            $this->ticketModel->update($t['id'], [
                'agent_id' => $selectedAgentId,
                'status'   => 'IN_PROGRESS',
            ]);

            $this->historyModel->insert([
                'ticket_id'   => $t['id'],
                'from_status' => $t['status'],
                'to_status'   => 'IN_PROGRESS',
                'changed_by'  => $selectedAgentId,
                'note'        => 'Auto-assigned by System Automation',
            ]);

            $this->notificationModel->insert([
                'user_id'    => $selectedAgentId,
                'type'       => 'TICKET_ASSIGNED',
                'title'      => 'Tiket Baru Ditugaskan',
                'body'       => "Tiket #{$t['ticket_number']} telah dialokasikan otomatis kepada Anda.",
                'link'       => "/dashboard/tickets/{$t['id']}",
                'is_read'    => 0,
                'created_at' => date('Y-m-d H:i:s'),
            ]);

            $agentWorkloads[$selectedAgentId]++;
            $assignedList[] = [
                'ticket_id'     => $t['id'],
                'ticket_number' => $t['ticket_number'],
                'agent_id'      => $selectedAgentId,
            ];
        }

        return [
            'assigned_count' => count($assignedList),
            'tickets'        => $assignedList,
        ];
    }

    public function monitorSlaAndEscalate(): array
    {
        $openTickets = $this->ticketModel
            ->whereIn('status', ['OPEN', 'IN_PROGRESS'])
            ->findAll();

        $escalated = [];
        $warned    = [];

        $admins = $this->userModel->where('role', 'admin')->where('is_active', 1)->findAll();

        foreach ($openTickets as $t) {
            $sla = $this->checkSla($t);

            if ($sla['is_breached']) {
                $newPriority = match ($t['priority']) {
                    'LOW'    => 'MEDIUM',
                    'MEDIUM' => 'HIGH',
                    'HIGH'   => 'URGENT',
                    default  => 'URGENT',
                };

                if ($newPriority !== $t['priority']) {
                    $this->ticketModel->update($t['id'], ['priority' => $newPriority]);
                    $this->historyModel->insert([
                        'ticket_id'   => $t['id'],
                        'from_status' => $t['status'],
                        'to_status'   => $t['status'],
                        'changed_by'  => 1,
                        'note'        => "SLA Breached ({$sla['remaining_hours']}j). Priority auto-escalated to {$newPriority}.",
                    ]);
                }

                foreach ($admins as $adm) {
                    $this->notificationModel->insert([
                        'user_id'    => $adm['id'],
                        'type'       => 'SLA_BREACH',
                        'title'      => 'Peringatan SLA Terlewat!',
                        'body'       => "Tiket #{$t['ticket_number']} telah melewati batas waktu SLA ({$t['priority']}).",
                        'link'       => "/dashboard/tickets/{$t['id']}",
                        'is_read'    => 0,
                        'created_at' => date('Y-m-d H:i:s'),
                    ]);
                }

                $escalated[] = [
                    'ticket_id'     => $t['id'],
                    'ticket_number' => $t['ticket_number'],
                    'old_priority'  => $t['priority'],
                    'new_priority'  => $newPriority,
                ];
            } elseif ($sla['remaining_hours'] > 0 && $sla['remaining_hours'] <= 2 && !empty($t['agent_id'])) {
                $this->notificationModel->insert([
                    'user_id'    => $t['agent_id'],
                    'type'       => 'SLA_WARNING',
                    'title'      => 'Mendekati Batas SLA',
                    'body'       => "Tiket #{$t['ticket_number']} tersisa {$sla['remaining_hours']} jam lagi sebelum SLA breach.",
                    'link'       => "/dashboard/tickets/{$t['id']}",
                    'is_read'    => 0,
                    'created_at' => date('Y-m-d H:i:s'),
                ]);
                $warned[] = $t['ticket_number'];
            }
        }

        return [
            'escalated_count' => count($escalated),
            'escalated'       => $escalated,
            'warned_count'    => count($warned),
            'warned'          => $warned,
        ];
    }
}
