<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateTicketStatusHistoriesTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'          => ['type' => 'BIGSERIAL'],
            'ticket_id'   => ['type' => 'BIGINT'],
            'from_status' => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => true],
            'to_status'   => ['type' => 'VARCHAR', 'constraint' => 20],
            'changed_by'  => ['type' => 'BIGINT'],
            'note'        => ['type' => 'TEXT', 'null' => true],
            'created_at'  => ['type' => 'TIMESTAMP', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addForeignKey('ticket_id', 'tickets', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('changed_by', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('ticket_status_histories');
    }

    public function down()
    {
        $this->forge->dropTable('ticket_status_histories');
    }
}
