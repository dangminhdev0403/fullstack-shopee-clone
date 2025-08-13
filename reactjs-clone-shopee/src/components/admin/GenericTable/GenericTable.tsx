"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface GenericTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch?: (value: string) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export function GenericTable<T>({
  columns,
  data,
  isLoading,
  page,
  totalPages,
  onPageChange,
  onSearch,
  onEdit,
  onDelete,
}: GenericTableProps<T>) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    onSearch?.(searchValue);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* Search */}
      {onSearch && (
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Tìm kiếm..."
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
          />
          <button
            onClick={handleSearch}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Tìm
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="border-b px-4 py-2 text-left text-sm font-medium dark:border-gray-600"
                >
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="border-b px-4 py-2 text-sm font-medium dark:border-gray-600">
                  Thao tác
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-6 text-center text-gray-500"
                >
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className="border-b px-4 py-2 text-sm dark:border-gray-600"
                    >
                      {col.render
                        ? col.render(row)
                        : String(row[col.key as keyof T] ?? "")}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="border-b px-4 py-2 text-sm dark:border-gray-600">
                      <div className="flex gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="rounded bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-600"
                          >
                            Sửa
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-6 text-center text-gray-500"
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50"
        >
          Trước
        </button>
        <span className="px-2 text-sm">
          {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </div>
  );
}
