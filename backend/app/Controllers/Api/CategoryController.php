<?php

namespace App\Controllers\Api;

use App\Models\CategoryModel;

class CategoryController extends BaseApiController
{
    protected CategoryModel $categories;

    public function __construct()
    {
        $this->categories = new CategoryModel();
    }

    public function index()
    {
        return $this->success($this->categories->findAll());
    }

    public function create()
    {
        $rules = ['name' => 'required|max_length[100]', 'sla_hours' => 'permit_empty|integer'];
        if (! $this->validate($rules)) {
            return $this->error('Validation failed', 422, $this->validator->getErrors());
        }
        $data = $this->request->getJSON(true);
        $id = $this->categories->insert($data);
        return $this->success($this->categories->find($id), 'Category created', 201);
    }

    public function update($id = null)
    {
        if (! $this->categories->find($id)) return $this->error('Category not found', 404);
        $this->categories->update($id, $this->request->getJSON(true));
        return $this->success($this->categories->find($id), 'Category updated');
    }

    public function delete($id = null)
    {
        if (! $this->categories->find($id)) return $this->error('Category not found', 404);
        $this->categories->delete($id);
        return $this->success(null, 'Category deleted');
    }
}
