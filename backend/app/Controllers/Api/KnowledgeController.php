<?php

namespace App\Controllers\Api;

use App\Models\KnowledgeArticleModel;

class KnowledgeController extends BaseApiController
{
    protected KnowledgeArticleModel $articles;

    public function __construct()
    {
        $this->articles = new KnowledgeArticleModel();
    }

    // ------------------------------------------------------------------ index
    // Customers: only PUBLISHED | Agents/Admin: all statuses
    public function index()
    {
        $role = $this->authUserRole();

        $filters = [
            'q'           => $this->request->getGet('q'),
            'category_id' => $this->request->getGet('category_id'),
        ];

        if (! in_array($role, ['admin', 'agent'], true)) {
            $filters['status'] = 'PUBLISHED';
        } else {
            $filters['status'] = $this->request->getGet('status') ?: '';
        }

        return $this->success($this->articles->listWithMeta($filters));
    }

    // ------------------------------------------------------------------- show
    public function show($id = null)
    {
        $article = $this->articles
            ->select('knowledge_articles.*, categories.name AS category_name, users.name AS author_name')
            ->join('categories', 'categories.id = knowledge_articles.category_id', 'left')
            ->join('users',      'users.id = knowledge_articles.created_by', 'left')
            ->find($id);

        if (! $article) {
            return $this->error('Article not found', 404);
        }

        // Customers can only see published articles
        if (! in_array($this->authUserRole(), ['admin', 'agent'], true) && $article['status'] !== 'PUBLISHED') {
            return $this->error('Article not found', 404);
        }

        return $this->success($article);
    }

    // ----------------------------------------------------------------- create
    public function create()
    {
        $rules = [
            'title'       => 'required|max_length[200]',
            'content'     => 'required',
            'category_id' => 'permit_empty|integer',
        ];

        if (! $this->validate($rules)) {
            return $this->error('Validation failed', 422, $this->validator->getErrors());
        }

        $data = $this->request->getJSON(true);
        $id   = $this->articles->insert([
            'title'       => $data['title'],
            'content'     => $data['content'],
            'category_id' => $data['category_id'] ?? null,
            'status'      => 'DRAFT',
            'created_by'  => $this->authUserId(),
        ]);

        return $this->success($this->articles->find($id), 'Article created', 201);
    }

    // ----------------------------------------------------------------- update
    public function update($id = null)
    {
        $article = $this->articles->find($id);
        if (! $article) return $this->error('Article not found', 404);

        $data    = $this->request->getJSON(true);
        $allowed = array_intersect_key($data, array_flip(['title', 'content', 'category_id']));
        $this->articles->update($id, $allowed);

        return $this->success($this->articles->find($id), 'Article updated');
    }

    // ----------------------------------------------------------------- delete
    public function delete($id = null)
    {
        if (! $this->articles->find($id)) return $this->error('Article not found', 404);
        $this->articles->delete($id);
        return $this->success(null, 'Article deleted');
    }

    // ---------------------------------------------------------------- publish
    public function publish($id = null)
    {
        return $this->changeStatus($id, 'PUBLISHED');
    }

    // ---------------------------------------------------------------- archive
    public function archive($id = null)
    {
        return $this->changeStatus($id, 'ARCHIVED');
    }

    // ------------------------------------------------------------------ draft  (revert to draft)
    public function draft($id = null)
    {
        return $this->changeStatus($id, 'DRAFT');
    }

    // ----------------------------------------------------------------- helper
    private function changeStatus($id, string $status)
    {
        $article = $this->articles->find($id);
        if (! $article) return $this->error('Article not found', 404);

        $this->articles->update($id, ['status' => $status]);
        return $this->success($this->articles->find($id), "Article set to {$status}");
    }
}
