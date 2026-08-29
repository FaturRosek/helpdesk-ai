<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateKnowledgeArticlesTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'          => ['type' => 'BIGSERIAL'],
            'category_id' => ['type' => 'BIGINT', 'null' => true],
            'title'       => ['type' => 'VARCHAR', 'constraint' => 200],
            'content'     => ['type' => 'TEXT'],
            'status'      => ['type' => 'VARCHAR', 'constraint' => 20, 'default' => 'DRAFT'],
            'created_by'  => ['type' => 'BIGINT'],
            'created_at'  => ['type' => 'TIMESTAMP', 'null' => true],
            'updated_at'  => ['type' => 'TIMESTAMP', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addForeignKey('category_id', 'categories', 'id', 'SET NULL', 'CASCADE');
        $this->forge->addForeignKey('created_by', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addKey('status');
        $this->forge->createTable('knowledge_articles');
    }

    public function down()
    {
        $this->forge->dropTable('knowledge_articles');
    }
}
