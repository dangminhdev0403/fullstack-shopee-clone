"use client";

import { AddCircleOutline, Delete, Edit } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Slide,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowId, GridToolbar } from "@mui/x-data-grid";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

// Định nghĩa interface cho đối tượng đơn hàng
interface Order {
  id: string;
  customer: string;
  channel: string;
  date: string;
  total: string;
  status: "Shipped" | "Paid" | "Processing" | "Unfulfilled" | "Cancelled";
}

// Dữ liệu giả định cho các đơn hàng
const initialOrders: Order[] = [
  {
    id: "#3210",
    customer: "Olivia Martin",
    channel: "Online Store",
    date: "2023-02-20",
    total: "$42.25",
    status: "Shipped",
  },
  {
    id: "#3209",
    customer: "Ava Johnson",
    channel: "Shop",
    date: "2023-01-05",
    total: "$74.99",
    status: "Paid",
  },
  {
    id: "#3208",
    customer: "Liam Brown",
    channel: "Online Store",
    date: "2023-03-10",
    total: "$120.00",
    status: "Processing",
  },
  {
    id: "#3207",
    customer: "Sophia Anderson",
    channel: "Shop",
    date: "2022-11-02",
    total: "$99.99",
    status: "Paid",
  },
  {
    id: "#3206",
    customer: "Daniel Smith",
    channel: "Online Store",
    date: "2022-10-07",
    total: "$67.50",
    status: "Shipped",
  },
  {
    id: "#3205",
    customer: "Emma White",
    channel: "Shop",
    date: "2022-09-01",
    total: "$55.00",
    status: "Cancelled",
  },
  {
    id: "#3204",
    customer: "Michael Johnson",
    channel: "Shop",
    date: "2022-08-03",
    total: "$64.75",
    status: "Unfulfilled",
  },
  {
    id: "#3203",
    customer: "Lisa Anderson",
    channel: "Online Store",
    date: "2022-07-15",
    total: "$34.50",
    status: "Shipped",
  },
  {
    id: "#3202",
    customer: "Samantha Green",
    channel: "Shop",
    date: "2022-06-05",
    total: "$89.99",
    status: "Paid",
  },
  {
    id: "#3201",
    customer: "Adam Barlow",
    channel: "Online Store",
    date: "2022-05-20",
    total: "$24.99",
    status: "Unfulfilled",
  },
  {
    id: "#3200",
    customer: "Chloe Davis",
    channel: "Shop",
    date: "2022-04-12",
    total: "$15.00",
    status: "Cancelled",
  },
  {
    id: "#3199",
    customer: "Noah Miller",
    channel: "Online Store",
    date: "2022-03-25",
    total: "$200.00",
    status: "Processing",
  },
];

// Theme tùy chỉnh
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
    background: { default: "#f4f6f8" },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h1: { fontSize: "1.8rem", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: "none" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 12 },
      },
    },
  },
});

// Hiệu ứng chuyển động cho Dialog
const Transition = Slide;

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterChannel, setFilterChannel] = useState<string>("all");
  const [openAddEditDialog, setOpenAddEditDialog] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] =
    useState<boolean>(false);
  const [orderToDeleteId, setOrderToDeleteId] = useState<GridRowId | null>(
    null,
  );

  // Schema xác thực form
  const validationSchema = Yup.object({
    customer: Yup.string().required("Tên khách hàng là bắt buộc"),
    channel: Yup.string().required("Kênh là bắt buộc"),
    date: Yup.date().required("Ngày là bắt buộc"),
    total: Yup.string()
      .matches(/^\$\d+(\.\d{2})?$/, "Tổng cộng phải có định dạng $X.XX")
      .required("Tổng cộng là bắt buộc"),
    status: Yup.string().required("Trạng thái là bắt buộc"),
  });

  // Lọc đơn hàng
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      order.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesChannel =
      filterChannel === "all" ||
      order.channel.toLowerCase() === filterChannel.toLowerCase();
    return matchesSearch && matchesStatus && matchesChannel;
  });

  // Tính toán số liệu tóm tắt
  const totalOrders = orders.length;
  const shippedOrders = orders.filter(
    (order) => order.status === "Shipped",
  ).length;
  const unfulfilledOrders = orders.filter(
    (order) => order.status === "Unfulfilled",
  ).length;
  const processingOrders = orders.filter(
    (order) => order.status === "Processing",
  ).length;

  // Xử lý mở dialog thêm/sửa
  const handleOpenAddDialog = () => {
    setCurrentOrder(null);
    setOpenAddEditDialog(true);
  };

  const handleOpenEditDialog = (orderId: GridRowId) => {
    const orderToEdit = orders.find((order) => order.id === orderId);
    if (orderToEdit) {
      setCurrentOrder(orderToEdit);
      setOpenAddEditDialog(true);
    }
  };

  const handleCloseAddEditDialog = () => {
    setOpenAddEditDialog(false);
    setCurrentOrder(null);
  };

  // Xử lý lưu đơn hàng
  const handleSaveOrder = (values: Omit<Order, "id"> | Order) => {
    if (currentOrder) {
      setOrders(
        orders.map((order) =>
          order.id === currentOrder.id ? (values as Order) : order,
        ),
      );
    } else {
      const newId = `#${Math.floor(Math.random() * 10000)}`;
      setOrders([...orders, { id: newId, ...(values as Omit<Order, "id">) }]);
    }
    handleCloseAddEditDialog();
  };

  // Xử lý xóa đơn hàng
  const handleOpenConfirmDeleteDialog = (orderId: GridRowId) => {
    setOrderToDeleteId(orderId);
    setOpenConfirmDeleteDialog(true);
  };

  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false);
    setOrderToDeleteId(null);
  };

  const handleDeleteOrder = () => {
    if (orderToDeleteId) {
      setOrders(orders.filter((order) => order.id !== orderToDeleteId));
    }
    handleCloseConfirmDeleteDialog();
  };

  // Định nghĩa cột cho DataGrid
  const columns: GridColDef<Order>[] = [
    { field: "id", headerName: "Mã đơn hàng", width: 120 },
    { field: "customer", headerName: "Khách hàng", width: 200 },
    { field: "channel", headerName: "Kênh", width: 150, hideable: true },
    { field: "date", headerName: "Ngày", width: 150, hideable: true },
    {
      field: "total",
      headerName: "Tổng cộng",
      width: 120,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      renderCell: (params) => {
        let color: "primary" | "success" | "warning" | "info" | "error" =
          "info";
        switch (params.value) {
          case "Shipped":
            color = "success";
            break;
          case "Paid":
            color = "primary";
            break;
          case "Processing":
            color = "warning";
            break;
          case "Unfulfilled":
            color = "error";
            break;
          case "Cancelled":
            color = "error";
            break;
        }
        return <Chip label={params.value} color={color} size="small" />;
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton
            color="primary"
            onClick={() => handleOpenEditDialog(params.row.id)}
            title="Sửa đơn hàng"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleOpenConfirmDeleteDialog(params.row.id)}
            title="Xóa đơn hàng"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  // Tùy chọn cho Autocomplete

  return (
    <ThemeProvider theme={theme}>
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6">
        {/* Header với tìm kiếm và bộ lọc */}
        <Box
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <h1 className="text-2xl font-semibold"> </h1>
          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Tìm kiếm khách hàng..."
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />

            <ButtonGroup variant="outlined" size="small">
              <Button
                variant={filterStatus === "all" ? "contained" : "outlined"}
                onClick={() => setFilterStatus("all")}
              >
                Tất cả
              </Button>
              <Button
                variant={filterStatus === "shipped" ? "contained" : "outlined"}
                onClick={() => setFilterStatus("shipped")}
              >
                Đã giao
              </Button>
              <Button
                variant={
                  filterStatus === "processing" ? "contained" : "outlined"
                }
                onClick={() => setFilterStatus("processing")}
              >
                Đang xử lý
              </Button>
            </ButtonGroup>
            <Button
              variant="contained"
              startIcon={<AddCircleOutline />}
              onClick={handleOpenAddDialog}
              sx={{ borderRadius: 8 }}
            >
              Tạo đơn hàng
            </Button>
          </Box>
        </Box>

        {/* Thẻ tóm tắt */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MuiCard
            title="Tổng số đơn hàng"
            value={totalOrders}
            description="Tổng số đơn hàng trong hệ thống"
            icon="📦"
          />
          <MuiCard
            title="Đơn hàng đã giao"
            value={shippedOrders}
            description="Đơn hàng đã hoàn thành và giao"
            icon="✅"
          />
          <MuiCard
            title="Đơn hàng đang xử lý"
            value={processingOrders}
            description="Đơn hàng đang chờ xử lý"
            icon="⏳"
          />
          <MuiCard
            title="Đơn hàng chưa hoàn thành"
            value={unfulfilledOrders}
            description="Đơn hàng chưa được hoàn thành"
            icon="⚠️"
          />
        </div>

        {/* Bảng đơn hàng */}
        <div style={{ width: "100%" }}>
          <DataGrid
            rows={filteredOrders}
            columns={columns}
            getRowId={(row) => row.id}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.background.default,
                borderRadius: "8px 8px 0 0",
              },
              "& .MuiDataGrid-cell": {
                padding: "8px 16px",
                transition: "background-color 0.2s",
                "&:hover": { backgroundColor: "#f5f5f5" },
              },
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
        </div>

        {/* Dialog thêm/sửa đơn hàng */}
        <Dialog open={openAddEditDialog} onClose={handleCloseAddEditDialog}>
          <DialogTitle>
            {currentOrder ? "Sửa Đơn hàng" : "Thêm Đơn hàng mới"}
          </DialogTitle>
          <Formik
            initialValues={
              currentOrder || {
                customer: "",
                channel: "",
                date: new Date().toISOString().split("T")[0],
                total: "$0.00",
                status: "Processing",
              }
            }
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleSaveOrder(values);
              setSubmitting(false);
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <DialogContent>
                  <Field
                    as={TextField}
                    autoFocus
                    name="customer"
                    label="Khách hàng"
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    error={touched.customer && !!errors.customer}
                    helperText={touched.customer && errors.customer}
                    sx={{ mb: 2 }}
                  />
                  <Field
                    as={TextField}
                    name="channel"
                    label="Kênh"
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    error={touched.channel && !!errors.channel}
                    helperText={touched.channel && errors.channel}
                    sx={{ mb: 2 }}
                  />
                  <Field
                    as={TextField}
                    name="date"
                    label="Ngày"
                    type="date"
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    error={touched.date && !!errors.date}
                    helperText={touched.date && errors.date}
                    sx={{ mb: 2 }}
                  />
                  <Field
                    as={TextField}
                    name="total"
                    label="Tổng cộng"
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    error={touched.total && !!errors.total}
                    helperText={touched.total && errors.total}
                    sx={{ mb: 2 }}
                  />
                  <Field
                    as={TextField}
                    name="status"
                    label="Trạng thái"
                    select
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    error={touched.status && !!errors.status}
                    helperText={touched.status && errors.status}
                  >
                    <MenuItem value="Shipped">Đã giao</MenuItem>
                    <MenuItem value="Paid">Đã thanh toán</MenuItem>
                    <MenuItem value="Processing">Đang xử lý</MenuItem>
                    <MenuItem value="Unfulfilled">Chưa hoàn thành</MenuItem>
                    <MenuItem value="Cancelled">Đã hủy</MenuItem>
                  </Field>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseAddEditDialog}>Hủy</Button>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    {currentOrder ? "Lưu thay đổi" : "Thêm"}
                  </LoadingButton>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </Dialog>

        {/* Dialog xác nhận xóa */}
        <Dialog
          open={openConfirmDeleteDialog}
          onClose={handleCloseConfirmDeleteDialog}
        >
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            Bạn có chắc chắn muốn xóa đơn hàng này không?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDeleteDialog}>Hủy</Button>
            <LoadingButton
              onClick={handleDeleteOrder}
              color="error"
              variant="contained"
            >
              Xóa
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}

// Component Card tùy chỉnh
interface MuiCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: string;
}

const MuiCard: React.FC<MuiCardProps> = ({
  title,
  value,
  description,
  icon,
}) => {
  const getCardColor = () => {
    switch (title) {
      case "Đơn hàng đã giao":
        return "#e6ffed";
      case "Đơn hàng đang xử lý":
        return "#fff3e0";
      case "Đơn hàng chưa hoàn thành":
        return "#ffebee";
      default:
        return "#f4f6f8";
    }
  };

  return (
    <div
      className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm transition-transform hover:scale-105"
      style={{ backgroundColor: getCardColor() }}
    >
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        <span className="text-muted-foreground text-lg">{icon}</span>
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
    </div>
  );
};
