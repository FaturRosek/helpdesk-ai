<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateTicketAttachmentsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'                => ['type' => 'BIGSERIAL'],
            'ticket_message_id' => ['type' => 'BIGINT'],
            'file_path'         => ['type' => 'VARCHAR', 'constraint' => 255],
            'file_name'         => ['type' => 'VARCHAR', 'constraint' => 255],
            'mime_type'         => ['type' => 'VARCHAR', 'constraint' => 100],
            'size_bytes'        => ['type' => 'BIGINT'],
            'created_at'        => ['type' => 'TIMESTAMP', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addForeignKey('ticket_message_id', 'ticket_messages', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('ticket_attachments');
    }

    public function down()
    {
        $this->forge->dropTable('ticket_attachments');
    }
}
