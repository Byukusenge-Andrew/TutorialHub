import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';

export function AdminTutorials() {
  const [tutorials, setTutorials] = useState([]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tutorial Management</h1>
        <Link
          to="/admin/tutorials/create"
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Tutorial
        </Link>
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Title</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Author</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Category</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Created</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tutorials.map((tutorial: any) => (
                <tr key={tutorial.id}>
                  <td className="px-6 py-4">{tutorial.title}</td>
                  <td className="px-6 py-4">{tutorial.author.name}</td>
                  <td className="px-6 py-4">{tutorial.category}</td>
                  <td className="px-6 py-4">
                    {new Date(tutorial.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button className="text-blue-500 hover:text-blue-700"
                      title = "Edit Tutorial"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-500 hover:text-red-700"
                      title='Delete Tutorial'
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 