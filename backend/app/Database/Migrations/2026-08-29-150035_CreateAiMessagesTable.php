<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateAiMessagesTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'              => ['type' => 'BIGSERIAL'],
            'conversation_id' => ['type' => 'BIGINT'],
            'role'            => ['type' => 'VARCHAR', 'constraint' => 20],
            'content'         => ['type' => 'TEXT'],
            'metadata'        => ['type' => 'JSONB', 'null' => true],
            'created_at'      => ['type' => 'TIMESTAMP', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addForeignKey('conversation_id', 'ai_conversations', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('ai_messages');
    }

    public function down()
    {
        $this->forge->dropTable('ai_messages');
    }
}
