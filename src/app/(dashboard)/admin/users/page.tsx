"use client";

import Pagination from "@/components/pages/Listings/Pagination";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import api from "@/lib/axios";
import { ApiResponse, User } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const PAGE_SIZE = 6;

const roleFilters = [
  { label: "All Roles", value: "" },
  { label: "Farmers", value: "FARMER" },
  { label: "Buyers", value: "BUYER" },
  { label: "Admins", value: "ADMIN" },
];

const statusFilters = [
  { label: "All Status", value: "" },
  { label: "Verified", value: "verified" },
  { label: "Unverified", value: "unverified" },
  { label: "Banned", value: "banned" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

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

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const isBanned = Boolean(
        (user as User & { isBanned?: boolean }).isBanned,
      );
      const matchesSearch =
        !term ||
        [user.name, user.email, user.location, user.companyName]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(term));

      const matchesRole = !roleFilter || user.role === roleFilter;
      const matchesStatus =
        !statusFilter ||
        (statusFilter === "verified" && user.isVerified && !isBanned) ||
        (statusFilter === "unverified" && !user.isVerified && !isBanned) ||
        (statusFilter === "banned" && isBanned);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, roleFilter, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
          Users
        </h1>
        <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>
          Manage platform users
        </p>
      </div>

      <div className='mb-6 grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_auto]'>
        <label className='block'>
          <span className='mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400'>
            Search users
          </span>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Name, email, location, or company'
            className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20'
          />
        </label>

        <label className='block'>
          <span className='mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400'>
            Role
          </span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20'>
            {roleFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </label>

        <label className='block'>
          <span className='mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400'>
            Status
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20'>
            {statusFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </label>

        <div className='flex items-end'>
          <Button
            variant='outline'
            onClick={() => {
              setSearchTerm("");
              setRoleFilter("");
              setStatusFilter("");
            }}>
            Clear
          </Button>
        </div>
      </div>

      <div className='mb-4 flex items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400'>
        <p>
          Showing{" "}
          <span className='font-medium text-gray-900 dark:text-gray-100'>
            {filteredUsers.length}
          </span>{" "}
          user
          {filteredUsers.length === 1 ? "" : "s"}
        </p>
        <p>
          Page {filteredUsers.length === 0 ? 0 : currentPage} of{" "}
          {totalPages || 1}
        </p>
      </div>

      {loading ? (
        <div className='space-y-3'>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className='bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 h-16 animate-pulse'
            />
          ))}
        </div>
      ) : (
        <>
          {filteredUsers.length === 0 ? (
            <div className='rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-16 text-center'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                No users found
              </h3>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                Try a different search or clear the filters.
              </p>
            </div>
          ) : (
            <div className='bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full min-w-[960px]'>
                  <thead>
                    <tr className='bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700'>
                      <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                        User
                      </th>
                      <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                        Role
                      </th>
                      <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                        Location
                      </th>
                      <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                        Status
                      </th>
                      <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100 dark:divide-gray-800'>
                    {paginatedUsers.map((user) => {
                      const isBanned = Boolean(
                        (user as User & { isBanned?: boolean }).isBanned,
                      );

                      return (
                        <tr
                          key={user.id}
                          className='hover:bg-gray-50 dark:hover:bg-gray-800/70'>
                          <td className='px-6 py-4'>
                            <div className='flex items-center gap-3'>
                              <div className='w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-700 dark:text-green-300 font-semibold text-sm'>
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className='font-medium text-gray-900 dark:text-gray-100 text-sm'>
                                  {user.name}
                                </p>
                                <p className='text-xs text-gray-400 dark:text-gray-500'>
                                  {user.email}
                                </p>
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
                            <p className='text-sm text-gray-600 dark:text-gray-300'>
                              {user.location ?? "—"}
                            </p>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex flex-wrap gap-2'>
                              {user.isVerified ? (
                                <Badge label='Verified' variant='success' />
                              ) : (
                                <Badge label='Unverified' variant='warning' />
                              )}
                              {isBanned && (
                                <Badge label='Banned' variant='danger' />
                              )}
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex flex-wrap gap-2'>
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
                              {!isBanned ? (
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}
