<?php

namespace App\Controllers\Api;

use App\Models\TicketModel;
use App\Models\UserModel;
use App\Models\CategoryModel;
use App\Libraries\AutomationService;

class ReportController extends BaseApiController
{
    protected TicketModel $tickets;
    protected UserModel $users;
    protected CategoryModel $categories;
    protected AutomationService $automation;

    public function __construct()
    {
        $this->tickets    = new TicketModel();
        $this->users      = new UserModel();
        $this->categories = new CategoryModel();
        $this->automation = new AutomationService();
    }

    public function summary()
    {
        $allTickets = $this->tickets->findAll();
        $total = count($allTickets);

        $statusCounts = [
            'OPEN'        => 0,
            'IN_PROGRESS' => 0,
            'RESOLVED'    => 0,
            'CLOSED'      => 0,
        ];

        $priorityCounts = [
            'LOW'    => 0,
            'MEDIUM' => 0,
            'HIGH'   => 0,
            'URGENT' => 0,
        ];

        $totalResolutionSeconds = 0;
        $resolvedCount = 0;
        $slaCompliant = 0;
        $slaBreached  = 0;

        foreach ($allTickets as $t) {
            $st = $t['status'] ?? 'OPEN';
            $pr = $t['priority'] ?? 'MEDIUM';

            if (isset($statusCounts[$st])) {
                $statusCounts[$st]++;
            }
            if (isset($priorityCounts[$pr])) {
                $priorityCounts[$pr]++;
            }

            $sla = $this->automation->checkSla($t);
            if ($sla['is_breached']) {
                $slaBreached++;
            } else {
                $slaCompliant++;
            }

            if (!empty($t['resolved_at']) && !empty($t['created_at'])) {
                $createdTs = strtotime($t['created_at']);
                $resTs     = strtotime($t['resolved_at']);
                if ($resTs >= $createdTs) {
                    $totalResolutionSeconds += ($resTs - $createdTs);
                    $resolvedCount++;
                }
            }
        }

        $avgResolutionHours = $resolvedCount > 0 ? round(($totalResolutionSeconds / $resolvedCount) / 3600, 1) : 0;
        $slaPercentage = $total > 0 ? round(($slaCompliant / $total) * 100, 1) : 100;
        $csatScore = $slaPercentage > 0 ? min(5.0, round(($slaPercentage / 100) * 4.5 + 0.5, 1)) : 4.5;

        $db = $this->tickets->db;

        $categoriesData = $db->table('categories')
            ->select('categories.id, categories.name, COUNT(tickets.id) as ticket_count')
            ->join('tickets', 'tickets.category_id = categories.id', 'left')
            ->groupBy('categories.id, categories.name')
            ->orderBy('ticket_count', 'DESC')
            ->get()
            ->getResultArray();

        $agentsData = $db->table('users')
            ->select('users.id, users.name, users.email, COUNT(tickets.id) as assigned_tickets')
            ->join('tickets', 'tickets.agent_id = users.id', 'left')
            ->where('users.role', 'agent')
            ->groupBy('users.id, users.name, users.email')
            ->orderBy('assigned_tickets', 'DESC')
            ->get()
            ->getResultArray();

        foreach ($agentsData as &$ag) {
            $resolvedByAgent = $db->table('tickets')
                ->where('agent_id', $ag['id'])
                ->whereIn('status', ['RESOLVED', 'CLOSED'])
                ->countAllResults();
            $ag['resolved_tickets'] = $resolvedByAgent;
            $ag['resolution_rate']  = $ag['assigned_tickets'] > 0 ? round(($resolvedByAgent / $ag['assigned_tickets']) * 100, 1) : 0;
        }

        return $this->success([
            'statistics' => [
                'total_tickets'    => $total,
                'open_tickets'     => $statusCounts['OPEN'],
                'in_progress'      => $statusCounts['IN_PROGRESS'],
                'resolved_tickets' => $statusCounts['RESOLVED'],
                'closed_tickets'   => $statusCounts['CLOSED'],
                'status_breakdown' => $statusCounts,
                'priority_breakdown' => $priorityCounts,
            ],
            'resolution_time' => [
                'average_hours'  => $avgResolutionHours,
                'resolved_count' => $resolvedCount,
            ],
            'sla_performance' => [
                'compliant_count'   => $slaCompliant,
                'breached_count'    => $slaBreached,
                'compliance_pct'    => $slaPercentage,
            ],
            'agent_performance'     => $agentsData,
            'category_statistics'   => $categoriesData,
            'customer_satisfaction' => [
                'score'       => $csatScore,
                'rating_scale' => '5.0',
                'satisfaction_pct' => min(100, round(($csatScore / 5) * 100)),
            ],
        ]);
    }
}
