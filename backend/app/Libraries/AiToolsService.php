<?php

namespace App\Libraries;

use App\Models\TicketModel;
use App\Models\TicketMessageModel;
use App\Models\TicketStatusHistoryModel;
use App\Models\KnowledgeArticleModel;
use App\Models\CategoryModel;
use App\Models\CustomerModel;

class AiToolsService
{
    private array $user;

    public function __construct(array $authUser)
    {
        $this->user = $authUser;
    }

    public function getToolDefinitions(): array
    {
        $role  = $this->user['role'];
        $tools = [];

        $tools[] = [
            'type' => 'function',
            'function' => [
                'name' => 'search_tickets',
                'description' => 'Cari atau tampilkan daftar tiket. Gunakan ini ketika user bertanya tentang tiket, status tiket, atau laporan tiket. Juga gunakan untuk analisis data tiket.',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'status'        => ['type' => 'string', 'enum' => ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], 'description' => 'Filter berdasarkan status tiket'],
                        'priority'      => ['type' => 'string', 'enum' => ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], 'description' => 'Filter berdasarkan prioritas'],
                        'keyword'       => ['type' => 'string', 'description' => 'Kata kunci untuk cari di subjek tiket'],
                        'ticket_number' => ['type' => 'string', 'description' => 'Nomor tiket spesifik, misal TKT-20260901-XXXX'],
                        'limit'         => ['type' => 'integer', 'description' => 'Jumlah maksimal tiket yang dikembalikan, default 10'],
                    ],
                    'required' => [],
                ],
            ],
        ];

        $tools[] = [
            'type' => 'function',
            'function' => [
                'name' => 'get_ticket_detail',
                'description' => 'Ambil detail lengkap satu tiket termasuk pesan/percakapannya.',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'ticket_id'     => ['type' => 'integer', 'description' => 'ID numerik tiket'],
                        'ticket_number' => ['type' => 'string',  'description' => 'Nomor tiket (alternatif dari ticket_id)'],
                    ],
                    'required' => [],
                ],
            ],
        ];

        if ($role === 'customer') {
            $tools[] = [
                'type' => 'function',
                'function' => [
                    'name' => 'create_ticket',
                    'description' => 'Buat tiket dukungan baru atas nama customer. Gunakan setelah AI memahami masalah user, menentukan prioritas, dan mengklasifikasikan kategorinya. Konfirmasi ke user sebelum membuat.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'subject'     => ['type' => 'string',  'description' => 'Judul/subjek tiket, ringkas dan jelas'],
                            'description' => ['type' => 'string',  'description' => 'Deskripsi lengkap masalah user'],
                            'priority'    => ['type' => 'string',  'enum' => ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], 'description' => 'Prioritas berdasarkan urgensi masalah'],
                            'category_id' => ['type' => 'integer', 'description' => 'ID kategori yang sesuai (opsional)'],
                        ],
                        'required' => ['subject', 'description', 'priority'],
                    ],
                ],
            ];
        }

        if (\in_array($role, ['admin', 'agent'])) {
            $tools[] = [
                'type' => 'function',
                'function' => [
                    'name' => 'update_ticket_priority',
                    'description' => 'Ubah prioritas tiket. Hanya admin dan agen yang bisa menggunakan ini.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'ticket_id' => ['type' => 'integer', 'description' => 'ID tiket yang akan diubah'],
                            'priority'  => ['type' => 'string',  'enum' => ['LOW', 'MEDIUM', 'HIGH', 'URGENT']],
                        ],
                        'required' => ['ticket_id', 'priority'],
                    ],
                ],
            ];

            $tools[] = [
                'type' => 'function',
                'function' => [
                    'name' => 'update_ticket_status',
                    'description' => 'Ubah status tiket (resolve, close, reopen). Hanya admin dan agen.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'ticket_id' => ['type' => 'integer'],
                            'action'    => ['type' => 'string', 'enum' => ['resolve', 'close', 'reopen'], 'description' => 'Aksi yang akan dilakukan'],
                        ],
                        'required' => ['ticket_id', 'action'],
                    ],
                ],
            ];

            $tools[] = [
                'type' => 'function',
                'function' => [
                    'name' => 'summarize_ticket',
                    'description' => 'Buat ringkasan singkat dari percakapan tiket untuk membantu agen. Ambil semua pesan tiket dan buat summary.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'ticket_id' => ['type' => 'integer'],
                        ],
                        'required' => ['ticket_id'],
                    ],
                ],
            ];
        }

        $tools[] = [
            'type' => 'function',
            'function' => [
                'name' => 'search_knowledge_base',
                'description' => 'Cari artikel di knowledge base/FAQ/SOP untuk menemukan solusi relevan terhadap masalah user. Selalu cari knowledge base dulu sebelum menyarankan buat tiket.',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'query'       => ['type' => 'string',  'description' => 'Kata kunci masalah atau topik yang dicari'],
                        'category_id' => ['type' => 'integer', 'description' => 'Filter berdasarkan kategori (opsional)'],
                    ],
                    'required' => ['query'],
                ],
            ],
        ];

        $tools[] = [
            'type' => 'function',
            'function' => [
                'name' => 'get_categories',
                'description' => 'Ambil daftar kategori tiket yang tersedia (Account, Network, Hardware, Software, dll). Gunakan untuk mengklasifikasikan tiket dengan benar.',
                'parameters' => [
                    'type'       => 'object',
                    'properties' => new \stdClass(),
                    'required'   => [],
                ],
            ],
        ];

        if (\in_array($role, ['admin', 'agent'])) {
            $tools[] = [
                'type' => 'function',
                'function' => [
                    'name' => 'get_ticket_stats',
                    'description' => 'Ambil statistik dan laporan tiket. Gunakan untuk pertanyaan seperti "berapa tiket open minggu ini", "tiket mana yang paling banyak", "kategori apa yang paling sering".',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'period'   => ['type' => 'string', 'enum' => ['today', 'week', 'month', 'all'], 'description' => 'Periode waktu analisis'],
                            'group_by' => ['type' => 'string', 'enum' => ['status', 'priority', 'category', 'agent'], 'description' => 'Kelompokkan data berdasarkan kolom ini'],
                        ],
                        'required' => [],
                    ],
                ],
            ];
        }

        return $tools;
    }

    public function execute(string $toolName, array $args): array
    {
        return match ($toolName) {
            'search_tickets'         => $this->searchTickets($args),
            'get_ticket_detail'      => $this->getTicketDetail($args),
            'create_ticket'          => $this->createTicket($args),
            'update_ticket_priority' => $this->updateTicketPriority($args),
            'update_ticket_status'   => $this->updateTicketStatus($args),
            'summarize_ticket'       => $this->summarizeTicket($args),
            'search_knowledge_base'  => $this->searchKnowledgeBase($args),
            'get_categories'         => $this->getCategories(),
            'get_ticket_stats'       => $this->getTicketStats($args),
            default                  => ['error' => "Tool '{$toolName}' tidak dikenal."],
        };
    }

    private function searchTickets(array $args): array
    {
        $model = new TicketModel();
        $role  = $this->user['role'];
        $db    = $model->db;

        $builder = $db->table('tickets')
            ->select('tickets.*, categories.name AS category_name, users.name AS customer_name')
            ->join('customers',  'customers.id = tickets.customer_id', 'left')
            ->join('users',      'users.id = customers.user_id', 'left')
            ->join('categories', 'categories.id = tickets.category_id', 'left');

        if ($role === 'customer') {
            $custModel = new CustomerModel();
            $cust      = $custModel->where('user_id', $this->user['id'])->first();
            $builder->where('tickets.customer_id', (int)($cust['id'] ?? 0));
        } elseif ($role === 'agent') {
            $builder->where('tickets.agent_id', $this->user['id']);
        }

        if (!empty($args['status']))        $builder->where('tickets.status', $args['status']);
        if (!empty($args['priority']))       $builder->where('tickets.priority', $args['priority']);
        if (!empty($args['keyword']))        $builder->like('tickets.subject', $args['keyword']);
        if (!empty($args['ticket_number']))  $builder->like('tickets.ticket_number', $args['ticket_number']);

        $limit   = \min((int)($args['limit'] ?? 10), 50);
        $tickets = $builder->orderBy('tickets.created_at', 'DESC')->limit($limit)->get()->getResultArray();

        if (empty($tickets)) {
            return ['found' => 0, 'tickets' => [], 'message' => 'Tidak ada tiket yang cocok dengan filter.'];
        }

        return [
            'found'   => \count($tickets),
            'tickets' => array_map(fn($t) => [
                'id'            => $t['id'],
                'ticket_number' => $t['ticket_number'],
                'subject'       => $t['subject'],
                'status'        => $t['status'],
                'priority'      => $t['priority'],
                'category'      => $t['category_name'] ?? '—',
                'customer'      => $t['customer_name'] ?? '—',
                'created_at'    => $t['created_at'],
            ], $tickets),
        ];
    }

    private function getTicketDetail(array $args): array
    {
        $model  = new TicketModel();
        $ticket = null;

        if (!empty($args['ticket_id'])) {
            $ticket = $model->find((int)$args['ticket_id']);
        } elseif (!empty($args['ticket_number'])) {
            $ticket = $model->where('ticket_number', $args['ticket_number'])->first()
                ?? $model->like('ticket_number', $args['ticket_number'])->first();
        }

        if (empty($ticket)) {
            return ['error' => 'Tiket tidak ditemukan.'];
        }

        if ($this->user['role'] === 'customer') {
            $custModel = new CustomerModel();
            $cust      = $custModel->where('user_id', $this->user['id'])->first();
            if ((int)$ticket['customer_id'] !== (int)($cust['id'] ?? -1)) {
                return ['error' => 'Anda tidak memiliki akses ke tiket ini.'];
            }
        }

        $msgModel = new TicketMessageModel();
        $q        = $msgModel->where('ticket_id', $ticket['id']);
        if ($this->user['role'] === 'customer') {
            $q = $q->where('is_internal', 0);
        }
        $messages = $q->orderBy('created_at', 'ASC')->findAll();

        $catName = '—';
        if (!empty($ticket['category_id'])) {
            $cat     = (new CategoryModel())->find($ticket['category_id']);
            $catName = $cat['name'] ?? '—';
        }

        return [
            'ticket' => [
                'id'            => $ticket['id'],
                'ticket_number' => $ticket['ticket_number'],
                'subject'       => $ticket['subject'],
                'description'   => $ticket['description'],
                'status'        => $ticket['status'],
                'priority'      => $ticket['priority'],
                'category'      => $catName,
                'created_at'    => $ticket['created_at'],
                'resolved_at'   => $ticket['resolved_at'] ?? null,
            ],
            'messages_count' => \count($messages),
            'messages' => array_map(fn($m) => [
                'sender_id'   => $m['sender_id'],
                'message'     => $m['message'],
                'is_internal' => (bool)$m['is_internal'],
                'created_at'  => $m['created_at'],
            ], \array_slice($messages, 0, 20)),
        ];
    }

    private function createTicket(array $args): array
    {
        if ($this->user['role'] !== 'customer') {
            return ['error' => 'Hanya customer yang dapat membuat tiket.'];
        }

        $custModel = new CustomerModel();
        $customer  = $custModel->where('user_id', $this->user['id'])->first();
        if (!$customer) {
            return ['error' => 'Profil customer tidak ditemukan.'];
        }

        $categoryId = null;
        if (!empty($args['category_id'])) {
            $cat = (new CategoryModel())->find((int)$args['category_id']);
            $categoryId = $cat ? (int)$args['category_id'] : null;
        }

        $ticketModel = new TicketModel();
        $histModel   = new TicketStatusHistoryModel();

        $id = $ticketModel->insert([
            'ticket_number' => $ticketModel->generateTicketNumber(),
            'customer_id'   => $customer['id'],
            'category_id'   => $categoryId,
            'subject'       => $args['subject'],
            'description'   => $args['description'],
            'priority'      => $args['priority'] ?? 'MEDIUM',
            'status'        => 'OPEN',
        ]);

        $histModel->insert([
            'ticket_id'   => $id,
            'from_status' => null,
            'to_status'   => 'OPEN',
            'changed_by'  => $this->user['id'],
            'note'        => 'Dibuat melalui AI Assistant',
        ]);

        $ticket = $ticketModel->find($id);
        return [
            'success'       => true,
            'message'       => 'Tiket berhasil dibuat.',
            'ticket_number' => $ticket['ticket_number'],
            'ticket_id'     => $id,
            'subject'       => $ticket['subject'],
            'priority'      => $ticket['priority'],
            'status'        => $ticket['status'],
        ];
    }

    private function updateTicketPriority(array $args): array
    {
        if (!\in_array($this->user['role'], ['admin', 'agent'])) {
            return ['error' => 'Tidak memiliki izin untuk mengubah prioritas tiket.'];
        }

        $model  = new TicketModel();
        $ticket = $model->find((int)$args['ticket_id']);
        if (!$ticket) return ['error' => 'Tiket tidak ditemukan.'];

        $model->update((int)$args['ticket_id'], ['priority' => $args['priority']]);

        return [
            'success'       => true,
            'message'       => "Prioritas tiket {$ticket['ticket_number']} berhasil diubah ke {$args['priority']}.",
            'ticket_number' => $ticket['ticket_number'],
            'old_priority'  => $ticket['priority'],
            'new_priority'  => $args['priority'],
        ];
    }

    private function updateTicketStatus(array $args): array
    {
        if (!\in_array($this->user['role'], ['admin', 'agent'])) {
            return ['error' => 'Tidak memiliki izin untuk mengubah status tiket.'];
        }

        $model     = new TicketModel();
        $histModel = new TicketStatusHistoryModel();
        $ticket    = $model->find((int)$args['ticket_id']);
        if (!$ticket) return ['error' => 'Tiket tidak ditemukan.'];

        $statusMap = ['resolve' => 'RESOLVED', 'close' => 'CLOSED', 'reopen' => 'OPEN'];
        $newStatus = $statusMap[$args['action']] ?? null;
        if (!$newStatus) return ['error' => 'Aksi tidak valid.'];

        $extra = [];
        if ($newStatus === 'RESOLVED') $extra['resolved_at'] = date('Y-m-d H:i:s');
        if ($newStatus === 'CLOSED')   $extra['closed_at']   = date('Y-m-d H:i:s');

        $model->update((int)$args['ticket_id'], ['status' => $newStatus, ...$extra]);
        $histModel->insert([
            'ticket_id'   => $args['ticket_id'],
            'from_status' => $ticket['status'],
            'to_status'   => $newStatus,
            'changed_by'  => $this->user['id'],
            'note'        => 'Diubah melalui AI Assistant',
        ]);

        return [
            'success'       => true,
            'message'       => "Status tiket {$ticket['ticket_number']} berhasil diubah ke {$newStatus}.",
            'ticket_number' => $ticket['ticket_number'],
            'old_status'    => $ticket['status'],
            'new_status'    => $newStatus,
        ];
    }

    private function summarizeTicket(array $args): array
    {
        if (!\in_array($this->user['role'], ['admin', 'agent'])) {
            return ['error' => 'Tidak memiliki izin.'];
        }

        $ticketModel = new TicketModel();
        $msgModel    = new TicketMessageModel();
        $ticket      = $ticketModel->find((int)$args['ticket_id']);
        if (!$ticket) return ['error' => 'Tiket tidak ditemukan.'];

        $messages     = $msgModel->where('ticket_id', $ticket['id'])->orderBy('created_at', 'ASC')->findAll();
        $conversation = array_map(fn($m) => ($m['is_internal'] ? '[INTERNAL] ' : '') . $m['message'], $messages);

        return [
            'ticket_number' => $ticket['ticket_number'],
            'subject'       => $ticket['subject'],
            'description'   => $ticket['description'],
            'status'        => $ticket['status'],
            'priority'      => $ticket['priority'],
            'message_count' => \count($messages),
            'conversation'  => $conversation,
            'instruction'   => 'Berdasarkan data di atas, buat ringkasan singkat (maks 3 poin) untuk agen yang akan menangani tiket ini.',
        ];
    }

    private function searchKnowledgeBase(array $args): array
    {
        $model    = new KnowledgeArticleModel();
        $filters  = ['q' => $args['query'] ?? '', 'status' => 'PUBLISHED'];
        if (!empty($args['category_id'])) {
            $filters['category_id'] = $args['category_id'];
        }

        $articles = $model->listWithMeta($filters);

        if (empty($articles)) {
            return ['found' => 0, 'articles' => [], 'message' => 'Tidak ada artikel yang relevan di knowledge base.'];
        }

        return [
            'found'    => \count($articles),
            'articles' => array_map(fn($a) => [
                'id'       => $a['id'],
                'title'    => $a['title'],
                'category' => $a['category_name'] ?? '—',
                'content'  => mb_substr($a['content'], 0, 600) . (mb_strlen($a['content']) > 600 ? '...' : ''),
            ], \array_slice($articles, 0, 5)),
        ];
    }

    private function getCategories(): array
    {
        $categories = (new CategoryModel())->findAll();
        return [
            'categories' => array_map(fn($c) => [
                'id'        => $c['id'],
                'name'      => $c['name'],
                'sla_hours' => $c['sla_hours'],
            ], $categories),
        ];
    }

    private function getTicketStats(array $args): array
    {
        if (!\in_array($this->user['role'], ['admin', 'agent'])) {
            return ['error' => 'Tidak memiliki izin untuk melihat statistik.'];
        }

        $db         = \Config\Database::connect();
        $period     = $args['period'] ?? 'all';
        $groupBy    = $args['group_by'] ?? 'status';

        $dateFilter = match ($period) {
            'today' => "AND DATE(created_at) = CURRENT_DATE",
            'week'  => "AND created_at >= NOW() - INTERVAL '7 days'",
            'month' => "AND created_at >= NOW() - INTERVAL '30 days'",
            default => '',
        };

        $groupMap = [
            'status'   => ['col' => 'status'],
            'priority' => ['col' => 'priority'],
            'category' => ['col' => 'c.name', 'join' => 'LEFT JOIN categories c ON c.id = tickets.category_id'],
            'agent'    => ['col' => 'u.name',  'join' => 'LEFT JOIN agents a ON a.id = tickets.agent_id LEFT JOIN users u ON u.id = a.user_id'],
        ];

        $g    = $groupMap[$groupBy] ?? $groupMap['status'];
        $join = $g['join'] ?? '';
        $col  = $g['col'];

        $rows     = $db->query("SELECT {$col} AS label, COUNT(*) AS total FROM tickets {$join} WHERE 1=1 {$dateFilter} GROUP BY {$col} ORDER BY total DESC")->getResultArray();
        $totalRow = $db->query("SELECT COUNT(*) AS total FROM tickets WHERE 1=1 {$dateFilter}")->getRowArray();

        return [
            'period'    => $period,
            'group_by'  => $groupBy,
            'total'     => (int)($totalRow['total'] ?? 0),
            'breakdown' => $rows,
        ];
    }
}
