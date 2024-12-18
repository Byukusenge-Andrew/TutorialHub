import React, { useState, useEffect } from 'react';
import { User, Shield, UserX } from 'lucide-react';
import { api } from '@/services/api';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin?: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.admin.getUsers();
      setUsers(response.users);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await api.admin.updateUserRole(userId, newRole);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span>Total Users: {users.length}</span>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">User</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Role</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Joined</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Last Login</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as 'user' | 'admin')}
                      className="bg-background border border-input rounded-md px-2 py-1"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button 
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')}
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <UserX className="w-4 h-4" />
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