<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateAuditLogsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'          => ['type' => 'BIGSERIAL'],
            'user_id'     => ['type' => 'BIGINT', 'null' => true],
            'module'      => ['type' => 'VARCHAR', 'constraint' => 50],
            'action'      => ['type' => 'VARCHAR', 'constraint' => 20],
            'path'        => ['type' => 'VARCHAR', 'constraint' => 255],
            'status_code' => ['type' => 'SMALLINT'],
            'ip_address'  => ['type' => 'VARCHAR', 'constraint' => 45, 'null' => true],
            'created_at'  => ['type' => 'TIMESTAMP', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addForeignKey('user_id', 'users', 'id', 'SET NULL', 'CASCADE');
        $this->forge->addKey(['module', 'created_at']);
        $this->forge->createTable('audit_logs');
    }

    public function down()
    {
        $this->forge->dropTable('audit_logs');
    }
}
