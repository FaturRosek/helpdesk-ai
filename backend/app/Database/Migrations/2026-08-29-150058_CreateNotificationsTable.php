<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateNotificationsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'         => ['type' => 'BIGSERIAL'],
            'user_id'    => ['type' => 'BIGINT'],
            'type'       => ['type' => 'VARCHAR', 'constraint' => 50],
            'title'      => ['type' => 'VARCHAR', 'constraint' => 200],
            'body'       => ['type' => 'TEXT', 'null' => true],
            'link'       => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'is_read'    => ['type' => 'SMALLINT', 'default' => 0],
            'created_at' => ['type' => 'TIMESTAMP', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addForeignKey('user_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addKey(['user_id', 'is_read']);
        $this->forge->createTable('notifications');
    }

    public function down()
    {
        $this->forge->dropTable('notifications');
    }
}
