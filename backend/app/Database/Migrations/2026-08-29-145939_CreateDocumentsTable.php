<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateDocumentsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'            => ['type' => 'BIGSERIAL'],
            'file_name'     => ['type' => 'VARCHAR', 'constraint' => 255],
            'file_path'     => ['type' => 'VARCHAR', 'constraint' => 255],
            'mime_type'     => ['type' => 'VARCHAR', 'constraint' => 100],
            'size_bytes'    => ['type' => 'BIGINT'],
            'status'        => ['type' => 'VARCHAR', 'constraint' => 20, 'default' => 'UPLOADED'],
            'error_message' => ['type' => 'TEXT', 'null' => true],
            'uploaded_by'   => ['type' => 'BIGINT'],
            'created_at'    => ['type' => 'TIMESTAMP', 'null' => true],
            'updated_at'    => ['type' => 'TIMESTAMP', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addForeignKey('uploaded_by', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('documents');
    }

    public function down()
    {
        $this->forge->dropTable('documents');
    }
}
