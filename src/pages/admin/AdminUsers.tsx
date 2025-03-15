import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { User } from '@/types/auth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/providers/AuthProvider';

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.admin.getUsers();
        if (response && typeof response === 'object' && response !== null && 'data' in response) {
          setUsers(response.data as User[]);
        } else {
          setError('Invalid response format');
          toast.error('Failed to load users data');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
        toast.error('Failed to load users data');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    console.log("Current user ID:", currentUser?.user?.id);
    console.log("User IDs from API:", users.map(u => u.id));
  }, [users, currentUser]);

  const handleEditUser = (user: User) => {
    // For now just show a toast
    toast.info(`Edit user: ${user.name}`);
    // Later you can implement a modal or redirect to edit page
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await api.admin.deleteUser(userId);
        toast.success('User deleted successfully');
        // Remove the user from the state
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      
      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">All Users ({users.length})</h2>
          <Button>Add User</Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                    {user.role}
                  </Badge>
                  '{currentUser?.user?.email === user.email && (
                    <Badge key="current-user" variant="outline" className="ml-2">
                      Current User
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={user.isVerified ? 'success' : 'destructive'}>
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={currentUser?.user?.email === user.email}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 