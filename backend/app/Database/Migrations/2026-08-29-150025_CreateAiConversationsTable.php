<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateAiConversationsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'         => ['type' => 'BIGSERIAL'],
            'user_id'    => ['type' => 'BIGINT'],
            'ticket_id'  => ['type' => 'BIGINT', 'null' => true],
            'title'      => ['type' => 'VARCHAR', 'constraint' => 200, 'null' => true],
            'created_at' => ['type' => 'TIMESTAMP', 'null' => true],
            'updated_at' => ['type' => 'TIMESTAMP', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addForeignKey('user_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('ticket_id', 'tickets', 'id', 'SET NULL', 'CASCADE');
        $this->forge->createTable('ai_conversations');
    }

    public function down()
    {
        $this->forge->dropTable('ai_conversations');
    }
}
