<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateDocumentChunksTable extends Migration
{
    public function up()
    {
        $this->db->query('CREATE EXTENSION IF NOT EXISTS vector');

        $this->forge->addField([
            'id'          => ['type' => 'BIGSERIAL'],
            'document_id' => ['type' => 'BIGINT'],
            'chunk_index' => ['type' => 'INT'],
            'content'     => ['type' => 'TEXT'],
            'metadata'    => ['type' => 'JSONB', 'null' => true],
            'created_at'  => ['type' => 'TIMESTAMP', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addForeignKey('document_id', 'documents', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('document_chunks');

        $this->db->query('ALTER TABLE document_chunks ADD COLUMN embedding vector(768)');

        $this->db->query('CREATE INDEX document_chunks_embedding_idx ON document_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)');
    }

    public function down()
    {
        $this->forge->dropTable('document_chunks');
    }
}
