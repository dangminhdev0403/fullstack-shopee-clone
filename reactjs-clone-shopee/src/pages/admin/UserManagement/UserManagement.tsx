"use client";

import {
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import {
  AlertCircle,
  CheckCircle,
  Edit,
  Eye,
  Filter,
  Search,
  Trash2,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";

const users = [
  {
    id: "U001",
    name: "Nguyễn Văn A",
    role: "Admin",
    email: "a@example.com",
    status: "active",
    orders: 120,
  },
  {
    id: "U002",
    name: "Trần Thị B",
    role: "User",
    email: "b@example.com",
    status: "inactive",
    orders: 15,
  },
  {
    id: "U003",
    name: "Lê Văn C",
    role: "Collaborator",
    email: "c@example.com",
    status: "active",
    orders: 48,
  },
];

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchRole = roleFilter === "all" || user.role === roleFilter;

    return matchSearch && matchRole;
  });

  const getStatusChip = (status: string) => {
    if (status === "active")
      return (
        <Chip
          icon={<CheckCircle size={16} />}
          label="Hoạt động"
          color="success"
          variant="outlined"
          size="small"
          className="border-green-200 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/20 dark:text-green-400"
        />
      );

    return (
      <Chip
        icon={<AlertCircle size={16} />}
        label="Bị khóa"
        color="error"
        variant="outlined"
        size="small"
        className="border-red-200 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400"
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between md:flex-row md:items-center">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            Quản lý người dùng
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Danh sách và quyền truy cập người dùng hệ thống
          </p>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<UsersIcon size={20} />}
          className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Thêm người dùng
        </Button>
      </div>

      {/* Stats */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} lg={4}>
          <Card className="rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <CardContent>
              <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Tổng người dùng
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                {users.length}
              </p>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Card className="rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <CardContent>
              <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Đang hoạt động
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                {users.filter((u) => u.status === "active").length}
              </p>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Card className="rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <CardContent>
              <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Đã bị khóa
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                {users.filter((u) => u.status === "inactive").length}
              </p>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <div className="mb-6 flex flex-col items-center gap-4 md:flex-row">
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm tên hoặc email..."
          variant="outlined"
          size="small"
          fullWidth
          className="w-full flex-grow rounded-md bg-white md:w-auto dark:bg-gray-800"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search
                  size={18}
                  className="text-gray-400 dark:text-gray-500"
                />
              </InputAdornment>
            ),
            className: "dark:text-gray-50 dark:border-gray-700",
          }}
        />
        <Select
          size="small"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          displayEmpty
          className="w-full rounded-md bg-white md:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
          inputProps={{
            className: "dark:text-gray-50",
          }}
        >
          <MenuItem value="all">Tất cả vai trò</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="User">User</MenuItem>
          <MenuItem value="Collaborator">Collaborator</MenuItem>
        </Select>
        <Button
          startIcon={<Filter size={20} />}
          variant="outlined"
          className="w-full rounded-md border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 md:w-auto dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Lọc nâng cao
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <Table>
          <TableHead>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableCell className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                Người dùng
              </TableCell>
              <TableCell className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                Email
              </TableCell>
              <TableCell className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                Vai trò
              </TableCell>
              <TableCell className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                Đơn hàng
              </TableCell>
              <TableCell className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                Trạng thái
              </TableCell>
              <TableCell
                align="right"
                className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
              >
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <TableCell>
                  <p className="font-medium text-gray-900 dark:text-gray-50">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    #{user.id}
                  </p>
                </TableCell>
                <TableCell className="text-sm text-gray-900 dark:text-gray-50">
                  {user.email}
                </TableCell>
                <TableCell className="text-sm text-gray-900 dark:text-gray-50">
                  {user.role}
                </TableCell>
                <TableCell className="text-sm text-gray-900 dark:text-gray-50">
                  {user.orders}
                </TableCell>
                <TableCell>{getStatusChip(user.status)}</TableCell>
                <TableCell align="right">
                  <IconButton className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <Eye size={18} />
                  </IconButton>
                  <IconButton className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <Edit size={18} />
                  </IconButton>
                  <IconButton className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200">
                    <Trash2 size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-4 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Không tìm thấy người dùng phù hợp.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
