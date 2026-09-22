<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddDocumentChunksTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'          => ['type' => 'BIGSERIAL'],
            'document_id' => ['type' => 'BIGINT'],
            'chunk_index' => ['type' => 'INT', 'default' => 0],
            'content'     => ['type' => 'TEXT'],
            'metadata'    => ['type' => 'TEXT', 'null' => true],
            'embedding'   => ['type' => 'TEXT', 'null' => true],
            'created_at'  => ['type' => 'TIMESTAMP', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addForeignKey('document_id', 'documents', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('document_chunks', true);
    }

    public function down()
    {
        $this->forge->dropTable('document_chunks', true);
    }
}
