<?php

namespace App\Models;

use CodeIgniter\Model;

class KnowledgeArticleModel extends Model
{
    protected $table      = 'knowledge_articles';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields = [
        'category_id', 'title', 'content', 'status', 'created_by',
    ];
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';

    /**
     * List articles with optional filters, joined with category & author.
     */
    public function listWithMeta(array $filters = []): array
    {
        $builder = $this
            ->select('knowledge_articles.*, categories.name AS category_name, users.name AS author_name')
            ->join('categories', 'categories.id = knowledge_articles.category_id', 'left')
            ->join('users',      'users.id = knowledge_articles.created_by', 'left')
            ->orderBy('knowledge_articles.updated_at', 'DESC');

        if (! empty($filters['status'])) {
            $builder->where('knowledge_articles.status', $filters['status']);
        }

        if (! empty($filters['category_id'])) {
            $builder->where('knowledge_articles.category_id', $filters['category_id']);
        }

        if (! empty($filters['q'])) {
            $q = $filters['q'];
            $builder->groupStart()
                ->like('knowledge_articles.title', $q)
                ->orLike('knowledge_articles.content', $q)
                ->groupEnd();
        }

        return $builder->findAll();
    }
}
