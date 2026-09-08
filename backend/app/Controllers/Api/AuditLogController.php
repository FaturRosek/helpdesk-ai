<?php

namespace App\Controllers\Api;

use App\Models\AuditLogModel;

class AuditLogController extends BaseApiController
{
    protected AuditLogModel $logs;

    public function __construct()
    {
        $this->logs = new AuditLogModel();
    }

    public function index()
    {
        $page    = (int) ($this->request->getGet('page') ?? 1);
        $perPage = (int) ($this->request->getGet('per_page') ?? 50);
        $module  = $this->request->getGet('module');

        $builder = $this->logs
            ->select('audit_logs.*, users.name as user_name, users.email as user_email')
            ->join('users', 'users.id = audit_logs.user_id', 'left')
            ->orderBy('audit_logs.created_at', 'DESC');

        if ($module) {
            $builder = $builder->where('audit_logs.module', $module);
        }

        $total = $builder->countAllResults(false);
        $data  = $builder->paginate($perPage, 'default', $page);

        return $this->success([
            'logs'       => $data,
            'total'      => $total,
            'page'       => $page,
            'per_page'   => $perPage,
            'last_page'  => (int) ceil($total / $perPage),
        ]);
    }
}
