import React, { useState } from 'react'
import { User, UserRole } from '../types/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { api } from '@/services/api';

export default function EditUser({user}: {user: User}) {
    
    const [selectedUser, setSelectedUser] = useState(user);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleUpdateUser = async (user: User) => {
        const response = await api.admin.updateUser(user._id, user);
        if (response && typeof response === 'object' && response !== null && 'data' in response) {
            setSelectedUser(response.data as User);
        }
    }
   
  return (
    //in the middle everything else is blured behind
    <div>
       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name
                </label>
                <input
                  id="name"
                  className="col-span-3 p-2 border rounded"
                  defaultValue={selectedUser.name}
                  onChange={(e) => {
                    if (selectedUser) {
                      setSelectedUser({...selectedUser, name: e.target.value});
                    }
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right">
                  Email
                </label>
                <input
                  id="email"
                  className="col-span-3 p-2 border rounded"
                  defaultValue={selectedUser.email}
                  onChange={(e) => {
                    if (selectedUser) {
                      setSelectedUser({...selectedUser, email: e.target.value});
                    }
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="role" className="text-right">
                  Role
                </label>
                <select
                  id="role"
                  className="col-span-3 p-2 border rounded"
                  defaultValue={selectedUser.role}
                  onChange={(e) => {
                    if (selectedUser) {
                      setSelectedUser({...selectedUser, role: e.target.value as UserRole});
                    }
                  }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleUpdateUser(selectedUser)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
