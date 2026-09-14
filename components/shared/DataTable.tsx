'use client';
import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ColumnDef<T> {
  key: keyof T;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  fill?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  actions?: {
    onView?: (row: T) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
  };
}

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  isLoading,
  emptyMessage = 'No records found.',
  onRowClick,
  fill,
  pagination,
  actions,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...data];
  if (sortKey) {
    sorted.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      const an = Number(av);
      const bn = Number(bv);
      if (!Number.isNaN(an) && !Number.isNaN(bn)) {
        return sortDir === 'asc' ? an - bn : bn - an;
      }
      return 0;
    });
  }

  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.total / pagination.pageSize))
    : 1;

  return (
    <div className={cn('overflow-hidden rounded-xl border border-border bg-surface', fill && 'flex min-h-0 flex-1 flex-col')}>
      <div className={cn('overflow-auto', fill && 'min-h-0 flex-1')}>
        <table className="w-full min-w-max text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-accent">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="border border-border/40 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-navyDeep"
                  style={{ width: col.width }}
                >
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="inline-flex items-center gap-1 transition-colors hover:text-navyDeep/80"
                    >
                      {col.header}
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <Search className="hidden" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
              {actions && <th className="border border-border/40 px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-navyDeep">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: pagination?.pageSize ?? 5 }).map((_, i) => (
                <tr key={i} className="h-14 border-b border-border">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-5">
                      <div className="h-4 w-full animate-pulse rounded bg-graySoft" />
                    </td>
                  ))}
                </tr>
              ))
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-5 py-16 text-center">
                  <p className="text-sm font-medium text-textSecondary">{emptyMessage}</p>
                  <p className="mt-1 text-xs text-textSecondary/70">Try adjusting your search or filters.</p>
                </td>
              </tr>
            ) : (
              <>
                {sorted.map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(
                      'h-14 border-b border-border transition-colors hover:bg-accentSoft/30',
                      rowIndex % 2 === 1 && 'bg-graySoft/40',
                      onRowClick && 'cursor-pointer'
                    )}
                  >
                    {columns.map((col) => (
                      <td key={String(col.key)} className="border-r border-border/40 px-5 align-middle last:border-r-0">
                        {col.render ? col.render(row) : String(row[col.key])}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-5 text-right align-middle">
                        <div className="inline-flex items-center gap-1">
                          {actions.onView && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                actions.onView?.(row);
                              }}
                              className="rounded-md px-2 py-1 text-xs font-medium text-navy transition-colors hover:bg-accentSoft hover:text-accentStrong"
                            >
                              View
                            </button>
                          )}
                          {actions.onEdit && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                actions.onEdit?.(row);
                              }}
                              className="rounded-md px-2 py-1 text-xs font-medium text-navy transition-colors hover:bg-graySoft"
                            >
                              Edit
                            </button>
                          )}
                          {actions.onDelete && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                actions.onDelete?.(row);
                              }}
                              className="rounded-md px-2 py-1 text-xs font-medium text-danger transition-colors hover:bg-dangerSoft"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {fill &&
                  pagination &&
                  Array.from({ length: Math.max(0, pagination.pageSize - sorted.length) }).map((_, i) => (
                    <tr key={`fill-${i}`} className="h-14 border-b border-border last:border-0">
                      <td
                        colSpan={columns.length + (actions ? 1 : 0)}
                        className="px-5"
                      />
                    </tr>
                  ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div
          className={cn(
            'flex shrink-0 flex-col gap-2 border-t border-border px-5 py-3 sm:flex-row sm:items-center sm:justify-between',
            fill && 'mt-auto'
          )}
        >
          <p className="text-xs text-textSecondary">
            Showing {(pagination.page - 1) * pagination.pageSize + 1}–
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="rounded-md border border-border p-1.5 text-navy transition-colors hover:bg-graySoft disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 text-sm font-medium text-navy">
              {pagination.page} / {totalPages}
            </span>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
              className="rounded-md border border-border p-1.5 text-navy transition-colors hover:bg-graySoft disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}