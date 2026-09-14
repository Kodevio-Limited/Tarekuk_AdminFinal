'use client';
import { useMemo, useState } from 'react';
import { Plus, Search, Pencil, Ban, CheckCircle2, UserPlus } from 'lucide-react';
import Button from '@/components/shared/Button';
import StatusBadge from '@/components/shared/StatusBadge';
import Avatar from '@/components/shared/Avatar';
import Modal from '@/components/shared/Modal';
import Drawer from '@/components/shared/Drawer';
import Reveal from '@/components/shared/Reveal';
import DataTable, { type ColumnDef } from '@/components/shared/DataTable';
import { useUsers } from '@/hooks/useUsers';
import { useUserDetails } from '@/hooks/useUser';
import type { User, AccountStatus } from '@/types/user';
import { formatCurrency, formatDate } from '@/lib/utils';

type StatusFilter = 'all' | AccountStatus;

export default function UsersPage() {
  const { data: users, updateUser, addUser } = useUsers();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selected, setSelected] = useState<User | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const pageSize = 10;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const { transfers, repayments } = useUserDetails(selected?.id ?? '');

  const columns: ColumnDef<User>[] = [
    {
      key: 'name',
      header: 'User',
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar name={u.name} color={u.avatarColor} size="sm" />
          <div>
            <p className="font-medium text-navy">{u.name}</p>
            <p className="text-xs text-textSecondary">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone', render: (u) => <span className="text-navy">{u.phone}</span> },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      sortable: true,
      render: (u) => <StatusBadge status={u.status} />,
    },
    {
      key: 'totalTransactions',
      header: 'Transactions',
      sortable: true,
      render: (u) => <span className="font-medium text-navy">{u.totalTransactions}</span>,
    },
    {
      key: 'registrationDate',
      header: 'Registered',
      sortable: true,
      render: (u) => <span className="text-textSecondary">{formatDate(u.registrationDate)}</span>,
    },
  ];

  const openDetail = (u: User) => {
    setSelected(u);
    setDetailOpen(true);
  };

  const handleStatusToggle = () => {
    if (!selected) return;
    const next: AccountStatus = selected.status === 'active' ? 'inactive' : 'active';
    updateUser(selected.id, { status: next });
    setConfirmOpen(false);
    setSelected({ ...selected, status: next });
  };

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-textSecondary" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or email..."
              className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-navy outline-none transition-colors placeholder:text-textSecondary focus:border-accent"
            />
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" /> Add New User
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['all', 'active', 'inactive', 'suspended'] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-accent text-navyDeep'
                  : 'border border-border bg-surface text-textSecondary hover:text-navy'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        </div>
      </Reveal>

      <DataTable
        data={paged}
        columns={columns}
        onRowClick={openDetail}
        emptyMessage="No users found."
        pagination={{ page, pageSize, total: filtered.length, onPageChange: setPage }}
        actions={{
          onView: openDetail,
        }}
      />

      {/* Detail drawer */}
      <Drawer
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="User Details"
        footer={
          selected && (
            <div className="flex w-full gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setDetailOpen(false)}>
                <Pencil className="h-4 w-4" /> Edit Info
              </Button>
              <Button
                variant={selected.status === 'active' ? 'danger' : 'primary'}
                className="flex-1"
                onClick={() => setConfirmOpen(true)}
              >
                {selected.status === 'active' ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                {selected.status === 'active' ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          )
        }
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={selected.name} color={selected.avatarColor} size="lg" />
              <div>
                <h3 className="text-lg font-semibold text-navy">{selected.name}</h3>
                <p className="text-sm text-textSecondary">{selected.email}</p>
                <div className="mt-1.5">
                  <StatusBadge status={selected.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-textSecondary">Phone</p>
                <p className="mt-1 text-sm font-medium text-navy">{selected.phone}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-textSecondary">Total Transactions</p>
                <p className="mt-1 text-sm font-medium text-navy">{selected.totalTransactions}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-textSecondary">Registered</p>
                <p className="mt-1 text-sm font-medium text-navy">{formatDate(selected.registrationDate)}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-textSecondary">Linked Payment</p>
                <p className="mt-1 text-sm font-medium text-navy">
                  {selected.linkedPaymentMethod
                    ? `${selected.linkedPaymentMethod.provider} •••• ${selected.linkedPaymentMethod.last4}`
                    : 'Not linked'}
                </p>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-navy">Transfer History</h4>
              {transfers.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-textSecondary">
                  No transfers yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {transfers.map((t) => (
                    <div key={t.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <p className="text-sm font-medium text-navy">{formatCurrency(t.amount)}</p>
                        <p className="text-xs text-textSecondary">to {t.recipient}</p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={t.status} />
                        <p className="mt-1 text-xs text-textSecondary">{formatDate(t.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-navy">Repayment History</h4>
              {repayments.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-textSecondary">
                  No repayment history.
                </p>
              ) : (
                <div className="space-y-2">
                  {repayments.map((r) => (
                    <div key={r.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <p className="text-sm font-medium text-navy">{formatCurrency(r.amountDue)}</p>
                        <p className="text-xs text-textSecondary">{r.id}</p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={r.status} />
                        <p className="mt-1 text-xs text-textSecondary">due {formatDate(r.dueDate)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Create user modal */}
      <CreateUserModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onAdd={(u) => {
          addUser(u);
          setCreateOpen(false);
        }}
      />

      {/* Confirm modal */}
      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={selected?.status === 'active' ? 'Deactivate User' : 'Activate User'}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant={selected?.status === 'active' ? 'danger' : 'primary'} onClick={handleStatusToggle}>
              Confirm
            </Button>
          </>
        }
      >
        <p className="text-sm text-navy">
          Are you sure you want to {selected?.status === 'active' ? 'deactivate' : 'activate'}{' '}
          <span className="font-semibold">{selected?.name}</span>?{' '}
          {selected?.status === 'active' && 'This user will no longer be able to send money.'}
        </p>
      </Modal>
    </div>
  );
}

function CreateUserModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (u: User) => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const cols: string[] = ['#FFC107', '#219A3B', '#F59E0B', '#374151', '#989898'];

  const handleSubmit = () => {
    if (!name || !email) return;
    onAdd({
      id: `usr_${Date.now()}`,
      name,
      email,
      phone: phone || '—',
      status: 'active',
      totalTransactions: 0,
      registrationDate: new Date().toISOString(),
      linkedPaymentMethod: null,
      avatarColor: cols[name.length % cols.length],
    });
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New User"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name || !email}>
            <UserPlus className="h-4 w-4" /> Create User
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John Doe"
            className="h-10 w-full rounded-lg border border-border px-3 text-sm text-navy outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="h-10 w-full rounded-lg border border-border px-3 text-sm text-navy outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Phone Number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 000 0000"
            className="h-10 w-full rounded-lg border border-border px-3 text-sm text-navy outline-none focus:border-accent"
          />
        </div>
      </div>
    </Modal>
  );
}