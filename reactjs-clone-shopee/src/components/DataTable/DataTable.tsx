"use client";

import type React from "react";

import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";
import { useState } from "react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  filterable?: boolean;
  filterOptions?: { value: string; label: string }[];
  onFilterChange?: (value: string) => void;
  actions?: (item: T) => React.ReactNode;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  paginated?: boolean;
  itemsPerPage?: number;
  showPaginationInfo?: boolean;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = false,
  searchPlaceholder = "Tìm kiếm...",
  filterable = false,
  filterOptions = [],
  onFilterChange,
  actions,
  className = "",
  emptyMessage = "Không có dữ liệu",
  loading = false,
  paginated = false,
  itemsPerPage = 10,
  showPaginationInfo = true,
  currentPage = 1,
  totalPages = 1,
  totalElements = 0,
  onPageChange,
}: Readonly<DataTableProps<T>>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Filter data based on search term
  const filteredData = data.filter((item) => {
    if (!searchable || !searchTerm) return true;

    return columns.some((column) => {
      const value = item[column.key as keyof T];
      return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const totalItems = filteredData.length;
  const startIndex = (currentPage - 1) * itemsPerPage;

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);

    onFilterChange?.(value);
  };

  const goToPage = (page: number) => {
    console.log("Go to page:", page);
    console.log("Loading state:", loading);

    if (page < 1 || page > totalPages) return;
    onPageChange(page - 1);
  };

  const goToPreviousPage = () => {
    goToPage(currentPage - 1);
  };

  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };

  const renderCellContent = (item: T, column: Column<T>) => {
    if (column.render) {
      return column.render(item);
    }
    return item[column.key as keyof T]?.toString() || "";
  };

  if (loading) {
    return (
      <div
        className={`rounded-2xl bg-white shadow-xl dark:bg-gray-800 ${className}`}
      >
        <div className="p-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-orange-500"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl bg-white shadow-xl dark:bg-gray-800 ${className}`}
    >
      {/* Header with search and filter */}
      {(searchable || filterable) && (
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex items-center space-x-4">
              {searchable && (
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-80 rounded-xl border border-gray-200 bg-gray-50 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                </div>
              )}

              {filterable && filterOptions.length > 0 && (
                <select
                  title="Filter"
                  value={selectedFilter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700"
                >
                  {filterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              <button className="flex items-center space-x-2 rounded-xl border border-gray-200 px-4 py-2 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                <Filter className="h-4 w-4" />
                <span>Lọc</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400 ${column.className || ""}`}
                >
                  {column.header}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Thao tác
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {data.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={index}
                  className="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 whitespace-nowrap ${column.className || ""}`}
                    >
                      {renderCellContent(item, column)}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {paginated && totalPages > 1 && (
        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            {/* Pagination info */}
            {showPaginationInfo && (
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Hiển thị <span className="font-medium">{data.length}</span> dữ
                liệu trong tổng số{" "}
                <span className="font-medium">{totalElements}</span> kết quả
              </div>
            )}

            {/* Pagination controls */}
            <div className="flex items-center space-x-2">
              <button
                title="Previous Page"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber: number;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-medium transition-colors duration-200 ${
                        currentPage === pageNumber
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                title="Next Page"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
