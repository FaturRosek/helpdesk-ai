<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateAgentsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'                 => ['type' => 'BIGSERIAL'],
            'user_id'            => ['type' => 'BIGINT'],
            'department'         => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
            'max_active_tickets' => ['type' => 'INT', 'default' => 20],
            'created_at'         => ['type' => 'TIMESTAMP', 'null' => true],
            'updated_at'         => ['type' => 'TIMESTAMP', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addForeignKey('user_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('agents');
    }

    public function down()
    {
        $this->forge->dropTable('agents');
    }
}
