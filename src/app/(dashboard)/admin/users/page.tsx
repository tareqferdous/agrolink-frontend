"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import api from "@/lib/axios";
import { ApiResponse, User } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get<ApiResponse<User[]>>("/api/admin/users");
      setUsers(res.data.data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdate = async (
    userId: string,
    data: { isVerified?: boolean; isBanned?: boolean },
  ) => {
    try {
      setUpdating(userId);
      await api.patch(`/api/admin/users/${userId}`, data);
      toast.success("User updated successfully");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Users</h1>
        <p className='text-gray-500 text-sm mt-1'>Manage platform users</p>
      </div>

      {loading ? (
        <div className='space-y-3'>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className='bg-white rounded-xl border border-gray-100 h-16 animate-pulse'
            />
          ))}
        </div>
      ) : (
        <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
          <table className='w-full'>
            <thead>
              <tr className='bg-gray-50 border-b border-gray-100'>
                <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase'>
                  User
                </th>
                <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase'>
                  Role
                </th>
                <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase'>
                  Location
                </th>
                <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase'>
                  Status
                </th>
                <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {users.map((user) => (
                <tr key={user.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm'>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className='font-medium text-gray-900 text-sm'>
                          {user.name}
                        </p>
                        <p className='text-xs text-gray-400'>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <Badge
                      label={user.role}
                      variant={
                        user.role === "FARMER"
                          ? "success"
                          : user.role === "BUYER"
                            ? "info"
                            : "warning"
                      }
                    />
                  </td>
                  <td className='px-6 py-4'>
                    <p className='text-sm text-gray-600'>
                      {user.location ?? "—"}
                    </p>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex gap-2'>
                      {user.isVerified ? (
                        <Badge label='Verified' variant='success' />
                      ) : (
                        <Badge label='Unverified' variant='warning' />
                      )}
                      {(user as any).isBanned && (
                        <Badge label='Banned' variant='danger' />
                      )}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex gap-2'>
                      {!user.isVerified && (
                        <Button
                          size='sm'
                          variant='outline'
                          loading={updating === user.id}
                          onClick={() =>
                            handleUpdate(user.id, { isVerified: true })
                          }>
                          Verify
                        </Button>
                      )}
                      {!(user as any).isBanned ? (
                        <Button
                          size='sm'
                          variant='danger'
                          loading={updating === user.id}
                          onClick={() =>
                            handleUpdate(user.id, { isBanned: true })
                          }>
                          Ban
                        </Button>
                      ) : (
                        <Button
                          size='sm'
                          variant='secondary'
                          loading={updating === user.id}
                          onClick={() =>
                            handleUpdate(user.id, { isBanned: false })
                          }>
                          Unban
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
