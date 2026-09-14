'use client';
import { useCallback, useState } from 'react';
import type { User } from '@/types/user';
import { users as mockUsers } from '@/lib/mock-data/users';

export function useUsers() {
  const [data, setData] = useState<User[]>(mockUsers);
  const [isLoading] = useState(false);

  const updateUser = useCallback((userId: string, patch: Partial<User>) => {
    setData((prev) => prev.map((u) => (u.id === userId ? { ...u, ...patch } : u)));
  }, []);

  const addUser = useCallback((newUser: User) => {
    setData((prev) => [newUser, ...prev]);
  }, []);

  return { data, isLoading, updateUser, addUser };
}