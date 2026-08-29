<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateTicketMessagesTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'          => ['type' => 'BIGSERIAL'],
            'ticket_id'   => ['type' => 'BIGINT'],
            'sender_id'   => ['type' => 'BIGINT'],
            'message'     => ['type' => 'TEXT'],
            'is_internal' => ['type' => 'SMALLINT', 'default' => 0],
            'created_at'  => ['type' => 'TIMESTAMP', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addForeignKey('ticket_id', 'tickets', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('sender_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('ticket_messages');
    }

    public function down()
    {
        $this->forge->dropTable('ticket_messages');
    }
}
