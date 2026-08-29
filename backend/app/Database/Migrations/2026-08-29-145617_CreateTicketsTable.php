<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateTicketsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'            => ['type' => 'BIGSERIAL'],
            'ticket_number' => ['type' => 'VARCHAR', 'constraint' => 30, 'unique' => true],
            'customer_id'   => ['type' => 'BIGINT'],
            'agent_id'      => ['type' => 'BIGINT', 'null' => true],
            'category_id'   => ['type' => 'BIGINT', 'null' => true],
            'subject'       => ['type' => 'VARCHAR', 'constraint' => 200],
            'description'   => ['type' => 'TEXT'],
            'priority'      => ['type' => 'VARCHAR', 'constraint' => 10, 'default' => 'MEDIUM'],
            'status'        => ['type' => 'VARCHAR', 'constraint' => 20, 'default' => 'OPEN'],
            'sla_due_at'    => ['type' => 'TIMESTAMP', 'null' => true],
            'resolved_at'   => ['type' => 'TIMESTAMP', 'null' => true],
            'closed_at'     => ['type' => 'TIMESTAMP', 'null' => true],
            'created_at'    => ['type' => 'TIMESTAMP', 'null' => true],
            'updated_at'    => ['type' => 'TIMESTAMP', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addForeignKey('customer_id', 'customers', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('agent_id', 'agents', 'id', 'SET NULL', 'CASCADE');
        $this->forge->addForeignKey('category_id', 'categories', 'id', 'SET NULL', 'CASCADE');
        $this->forge->addKey(['status', 'priority']);
        $this->forge->createTable('tickets');
    }

    public function down()
    {
        $this->forge->dropTable('tickets');
    }
}
