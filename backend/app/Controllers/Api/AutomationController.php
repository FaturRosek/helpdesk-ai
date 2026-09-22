<?php

namespace App\Controllers\Api;

use App\Libraries\AutomationService;
use App\Models\TicketModel;

class AutomationController extends BaseApiController
{
    protected AutomationService $automation;
    protected TicketModel $tickets;

    public function __construct()
    {
        $this->automation = new AutomationService();
        $this->tickets    = new TicketModel();
    }

    public function autoAssign()
    {
        $result = $this->automation->autoAssignTickets();
        return $this->success($result, "Berhasil mengalokasikan {$result['assigned_count']} tiket.");
    }

    public function monitorSla()
    {
        $result = $this->automation->monitorSlaAndEscalate();
        return $this->success($result, "Monitoring SLA selesai. {$result['escalated_count']} tiket dieskalasi.");
    }

    public function status()
    {
        $unassigned = $this->tickets
            ->where('agent_id IS NULL', null, false)
            ->whereIn('status', ['OPEN'])
            ->countAllResults();

        $activeTickets = $this->tickets
            ->whereIn('status', ['OPEN', 'IN_PROGRESS'])
            ->findAll();

        $breached = 0;
        $nearBreach = 0;

        foreach ($activeTickets as $t) {
            $sla = $this->automation->checkSla($t);
            if ($sla['is_breached']) {
                $breached++;
            } elseif ($sla['remaining_hours'] > 0 && $sla['remaining_hours'] <= 3) {
                $nearBreach++;
            }
        }

        return $this->success([
            'unassigned_tickets' => $unassigned,
            'sla_breached'       => $breached,
            'sla_near_breach'    => $nearBreach,
            'active_monitored'   => count($activeTickets),
        ]);
    }
}
