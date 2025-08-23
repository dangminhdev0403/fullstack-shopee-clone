import { AddressDialog } from "@components/Dialog";
import { useAlert } from "@hooks/useAlert";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Skeleton,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useShippingFee } from "@react-query/callApi";
import { AddressDTO, useGetAddressesQuery } from "@redux/api/addressApi";
import { CreateOrderRequest, useCheckOutMutation } from "@redux/api/orderApi";
import { RootState } from "@redux/store";
import { GHNShippingFeeRequest } from "@service/product.service";
import { ROUTES } from "@utils/constants/route";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  Building2,
  Check,
  CheckCircle,
  Clock,
  CreditCard,
  Edit,
  Eye,
  Gift,
  Home,
  Info,
  MapIcon,
  MapPin,
  RefreshCw,
  Shield,
  ShoppingBag,
  Smartphone,
  Truck,
  Wallet,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

// Enhanced Interfaces

interface PaymentMethodDTO {
  id: string;
  name: string;
  type: "cod" | "bank" | "ewallet" | "card" | "installment";
  icon: React.ElementType;
  description: string;
  fee?: number;
  discount?: number;
  isRecommended?: boolean;
  processingTime?: string;
  benefits?: string[];
}
const mockPaymentMethods: PaymentMethodDTO[] = [
  {
    id: "cod",
    name: "Thanh toán khi nhận hàng (COD)",
    type: "cod",
    icon: Truck,
    description: "Kiểm tra hàng trước khi thanh toán",
    fee: 15000,
    processingTime: "Khi giao hàng",
    benefits: ["Kiểm tra hàng", "An toàn 100%"],
  },
  {
    id: "momo",
    name: "Ví MoMo",
    type: "ewallet",
    icon: Wallet,
    description: "Thanh toán nhanh chóng, bảo mật cao",
    discount: 15000,
    isRecommended: true,
    processingTime: "Tức thì",
    benefits: ["Hoàn tiền 2%", "Tích điểm", "Bảo mật 2 lớp"],
  },
  {
    id: "zalopay",
    name: "ZaloPay",
    type: "ewallet",
    icon: Smartphone,
    description: "Ưu đãi độc quyền cho người dùng mới",
    discount: 20000,
    processingTime: "Tức thì",
    benefits: ["Giảm 20k cho đơn đầu", "Tích xu đổi quà"],
  },

  {
    id: "bank",
    name: "Chuyển khoản ngân hàng",
    type: "bank",
    icon: Building2,
    description: "Chuyển khoản trực tiếp qua ngân hàng",
    processingTime: "5-15 phút",
    benefits: ["Bảo mật cao", "Không phí giao dịch"],
  },
];

interface VoucherDTO {
  id: string;
  code: string;
  title: string;
  discount: number;
  type: "percentage" | "fixed" | "shipping";
  minOrder: number;
  maxDiscount?: number;
  expiry: Date;
  usageLimit?: number;
  description: string;
}

interface ShippingOptionDTO {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  icon: React.ElementType;
  features: string[];
  isRecommended?: boolean;
}

const mockVouchers: VoucherDTO[] = [
  {
    id: "1",
    code: "FREESHIP50",
    title: "Miễn phí vận chuyển",
    discount: 50000,
    type: "shipping",
    minOrder: 200000,
    expiry: new Date("2024-12-31"),
    description: "Miễn phí ship cho đơn từ 200k",
  },
  {
    id: "2",
    code: "SAVE20",
    title: "Giảm 20%",
    discount: 20,
    type: "percentage",
    minOrder: 500000,
    maxDiscount: 100000,
    expiry: new Date("2024-12-31"),
    description: "Giảm 20% tối đa 100k cho đơn từ 500k",
  },
  {
    id: "3",
    code: "NEWUSER100",
    title: "Người dùng mới",
    discount: 100000,
    type: "fixed",
    minOrder: 300000,
    expiry: new Date("2024-12-31"),
    description: "Giảm 100k cho khách hàng mới",
  },
];

export default function CheckOutPage() {
  const { data, isLoading: isLoadingAddresses } = useGetAddressesQuery();
  const [checkOut] = useCheckOutMutation();

  const addresses: AddressDTO[] = useMemo(() => data ?? [], [data]);

  const checkoutCart = useSelector((state: RootState) => state.checkout.cart);
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState<AddressDTO | null>(
    null,
  );

  const [selectedPayment, setSelectedPayment] = useState<string>("cod");
  const [selectedShipping, setSelectedShipping] = useState<string>("express");
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [showVoucherDialog, setShowVoucherDialog] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVouchers, setAppliedVouchers] = useState<VoucherDTO[]>([]);
  const [feeRequest, setFeeRequest] = useState<GHNShippingFeeRequest>({
    service_id: 53321,
    insurance_value: 500000,
    from_district_id: 1542,
    to_district_id: 1444,
    to_ward_code: "20314",
    height: 15,
    length: 15,
    weight: 1000,
    width: 10,
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const { confirm, error: errorAlert } = useAlert();

  type NotificationType = "success" | "error" | "info" | "warning";
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: NotificationType;
  }>({
    open: false,
    message: "",
    type: "success",
  });

  const [estimatedDelivery, setEstimatedDelivery] = useState<Date>(new Date());
  const { data: shippingFeeData, error: shippingFeeError } =
    useShippingFee(feeRequest);
  const mockShippingOptions: ShippingOptionDTO[] = useMemo(
    () =>
      shippingFeeData
        ? [
            {
              id: "express",
              name: "Giao hàng nhanh",
              price: shippingFeeData.total || 0,
              estimatedDays: "1-2 ngày",
              icon: Zap,
              features: [
                "Giao trong ngày",
                "Theo dõi realtime",
                "Bảo hiểm 100%",
              ],
              isRecommended: true,
            },
          ]
        : [],
    [shippingFeeData],
  );

  // Simulate page loading
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0]);
    }
    if (!selectedAddress) return;
    setFeeRequest((prev) => ({
      ...prev,
      to_district_id: selectedAddress.districtId,
      to_ward_code: selectedAddress.wardId
        ? String(selectedAddress.wardId)
        : "",
    }));
    setTimeout(() => setPageLoading(false), 1500);

    // Calculate estimated delivery
    const shipping = mockShippingOptions.find((s) => s.id === selectedShipping);
    if (shipping) {
      const days = Number.parseInt(
        shipping.estimatedDays.split("-")[1] ||
          shipping.estimatedDays.split("-")[0],
      );
      const delivery = new Date();
      delivery.setDate(delivery.getDate() + days);
      setEstimatedDelivery(delivery);
    }
  }, [addresses, mockShippingOptions, selectedAddress, selectedShipping]);

  // Calculations
  const subtotal = checkoutCart.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  );
  const selectedShippingOption = mockShippingOptions.find(
    (s) => s.id === selectedShipping,
  );
  const shippingFee = selectedShippingOption?.price ?? 0;
  const selectedPaymentMethod = mockPaymentMethods.find(
    (p) => p.id === selectedPayment,
  );
  const paymentFee = selectedPaymentMethod?.fee ?? 0;
  const paymentDiscount = selectedPaymentMethod?.discount ?? 0;

  const voucherDiscount = appliedVouchers.reduce((total, voucher) => {
    if (voucher.type === "percentage") {
      const discount = (subtotal * voucher.discount) / 100;
      return total + Math.min(discount, voucher.maxDiscount ?? discount);
    } else if (voucher.type === "shipping") {
      return total + Math.min(voucher.discount, shippingFee);
    }
    return total + voucher.discount;
  }, 0);

  const totalAmount =
    subtotal + shippingFee + paymentFee + paymentDiscount - voucherDiscount;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const handleApplyVoucher = () => {
    const voucher = mockVouchers.find(
      (v) => v.code.toLowerCase() === voucherCode.toLowerCase(),
    );
    if (
      voucher &&
      subtotal >= voucher.minOrder &&
      !appliedVouchers.find((v) => v.id === voucher.id)
    ) {
      setAppliedVouchers((prev) => [...prev, voucher]);
      setVoucherCode("");
      setNotification({
        open: true,
        message: `Áp dụng voucher ${voucher.title} thành công!`,
        type: "success",
      });
    } else {
      setNotification({
        open: true,
        message: "Mã voucher không hợp lệ hoặc đã được sử dụng",
        type: "error",
      });
    }
  };

  const handleRemoveVoucher = (voucherId: string) => {
    setAppliedVouchers((prev) => prev.filter((v) => v.id !== voucherId));
    setNotification({ open: true, message: "Đã bỏ voucher", type: "info" });
  };

  const handlePlaceOrder = async () => {
    let data: CreateOrderRequest = {
      receiverName: selectedAddress?.name || "",
      receiverAddress: selectedAddress?.fullAddress || "",
      receiverPhone: selectedAddress?.phone || "",
      shippingFee,
      paymentMethod: selectedPaymentMethod?.id.toUpperCase() as "COD" | "MOMO",
      discount: paymentDiscount,
      items: checkoutCart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        shopId: item.shop,
      })),
    };
    if (!selectedAddress) {
      setNotification({
        open: true,
        message: "Vui lòng chọn địa chỉ giao hàng",
        type: "error",
      });
      return;
    }

    confirm(
      "Xác nhận đặt hàng",
      "Bạn có chắc chắn muốn đặt hàng?",
      async () => {
        try {
          await checkOut(data).unwrap(); // gọi mutation
          setLoading(false);

          toast.success("Đặt hàng thành công!");
          navigate(ROUTES.ACCOUNT.ORDER);
        } catch (error) {
          setLoading(false);
          errorAlert("Đặt hàng thất bại", "Vui lòng thử lại sau.");
          console.error("Checkout error:", error);
        }
      },
    );
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-6xl">
          <Skeleton variant="rectangular" height={60} className="mb-6" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rectangular" height={200} />
              ))}
            </div>
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <Skeleton key={i} variant="rectangular" height={300} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="mx-auto max-w-6xl p-4">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            startIcon={<ArrowLeft />}
            className="mb-4 text-gray-600 hover:bg-white/50"
            onClick={() => window.history.back()}
          >
            Quay lại giỏ hàng
          </Button>

          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <ShoppingBag className="h-8 w-8 text-orange-500" />
              </motion.div>
              <Typography variant="h4" className="font-bold text-gray-800">
                Thanh toán
              </Typography>
              <Badge badgeContent="Mới" color="error">
                <Chip
                  label="Bảo mật SSL"
                  icon={<Shield className="h-4 w-4" />}
                  className="bg-green-100 text-green-700"
                />
              </Badge>
            </div>
          </div>

          {/* Enhanced Progress Stepper */}
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Enhanced Forms */}
          <div className="space-y-6 lg:col-span-2">
            {/* Enhanced Delivery Address */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="overflow-hidden shadow-lg transition-shadow hover:shadow-xl">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-orange-500" />
                      <Typography variant="h6" className="font-semibold">
                        Địa chỉ giao hàng
                      </Typography>
                      <Chip
                        label="Đã xác minh"
                        size="small"
                        className="bg-blue-100 text-blue-700"
                        icon={<CheckCircle className="h-3 w-3" />}
                      />
                    </div>

                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => setShowAddressDialog(true)}
                      className="hover:bg-orange-50"
                    >
                      {selectedAddress ? "Thay đổi" : "Thêm điểm giao hàng"}
                    </Button>
                  </div>

                  {selectedAddress?.name ? (
                    <Box className="rounded-lg border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <Typography
                              variant="subtitle1"
                              className="font-semibold"
                            >
                              {selectedAddress?.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              className="text-gray-600"
                            >
                              {selectedAddress?.phone}
                            </Typography>
                            <Chip
                              label={
                                selectedAddress?.type === "home"
                                  ? "Nhà riêng"
                                  : "Văn phòng"
                              }
                              size="small"
                              icon={
                                selectedAddress?.type === "home" ? (
                                  <Home className="h-3 w-3" />
                                ) : (
                                  <Building2 className="h-3 w-3" />
                                )
                              }
                              className="bg-orange-100 text-orange-700"
                            />
                            {selectedAddress?.isDefault && (
                              <Chip
                                label="Mặc định"
                                size="small"
                                className="bg-green-100 text-green-700"
                              />
                            )}
                          </div>
                          <Typography
                            variant="body2"
                            className="mb-2 text-gray-700"
                          >
                            {selectedAddress?.fullAddress}
                          </Typography>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                Giao hàng:{" "}
                                {estimatedDelivery.toLocaleDateString("vi-VN")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapIcon className="h-3 w-3" />
                              <span>Khoảng cách: 5.2km</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Box>
                  ) : (
                    <div className="text-center text-gray-600">
                      Bạn chưa có địa chỉ
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Products Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-orange-500" />
                      <Typography variant="h6" className="font-semibold">
                        Sản phẩm đã chọn
                      </Typography>
                      <Chip
                        label={`${checkoutCart.length} sản phẩm`}
                        className="bg-blue-100 text-blue-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(checkoutCart || []).map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group"
                      >
                        <div className="flex gap-4 rounded-lg border border-gray-200 p-4 transition-all hover:border-orange-300 hover:shadow-md">
                          <div className="relative">
                            <img
                              src={product.image ?? "/placeholder.svg"}
                              alt={product.name}
                              className="h-20 w-20 rounded-lg object-cover"
                            />
                          </div>

                          <div className="flex-1">
                            <Typography
                              variant="subtitle1"
                              className="mb-1 line-clamp-2 font-medium"
                            >
                              {product.name}
                            </Typography>
                          </div>

                          <div className="text-right">
                            <div className="mb-1 flex items-center gap-2">
                              <Typography
                                variant="h6"
                                className="font-bold text-orange-600"
                              >
                                {formatPrice(product.price)}
                              </Typography>
                            </div>
                            <Typography
                              variant="body2"
                              className="mb-2 text-gray-600"
                            >
                              x{product.quantity}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              className="font-semibold text-gray-800"
                            >
                              {formatPrice(product.price * product.quantity)}
                            </Typography>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Shipping Options */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-orange-500" />
                    <Typography variant="h6" className="font-semibold">
                      Phương thức vận chuyển
                    </Typography>
                  </div>

                  <RadioGroup
                    value={selectedShipping}
                    onChange={(e) => setSelectedShipping(e.target.value)}
                  >
                    <div className="space-y-3">
                      {shippingFeeError ? (
                        <Typography variant="body2" className="text-red-600">
                          Không thể tính phí vận chuyển cho địa chỉ này.
                        </Typography>
                      ) : (
                        mockShippingOptions.map((option) => (
                          <div
                            key={option.id}
                            className={`rounded-lg border-2 p-4 transition-all ${
                              selectedShipping === option.id
                                ? "border-orange-300 bg-orange-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <FormControlLabel
                              value={option.id}
                              control={<Radio sx={{ color: "orange.main" }} />}
                              label={
                                <div className="flex w-full items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <option.icon className="h-5 w-5 text-gray-600" />
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <Typography
                                          variant="subtitle1"
                                          className="font-medium"
                                        >
                                          {option.name}
                                        </Typography>
                                        {option.isRecommended && (
                                          <Chip
                                            label="Đề xuất"
                                            size="small"
                                            className="bg-orange-100 text-orange-700"
                                          />
                                        )}
                                      </div>
                                      <Typography
                                        variant="body2"
                                        className="text-gray-600"
                                      >
                                        {option.estimatedDays}
                                      </Typography>
                                      <div className="mt-1 flex flex-wrap gap-1">
                                        {option.features.map((feature, idx) => (
                                          <Chip
                                            key={idx}
                                            label={feature}
                                            size="small"
                                            variant="outlined"
                                            className="text-xs"
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <Typography
                                    variant="h6"
                                    className="font-bold text-orange-600"
                                  >
                                    {option.price === 0
                                      ? "Miễn phí"
                                      : formatPrice(option.price)}
                                  </Typography>
                                </div>
                              }
                              className="m-0 w-full"
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Payment Methods */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-orange-500" />
                    <Typography variant="h6" className="font-semibold">
                      Phương thức thanh toán
                    </Typography>
                    <Chip
                      label="Bảo mật 256-bit"
                      size="small"
                      className="bg-green-100 text-green-700"
                      icon={<Shield className="h-3 w-3" />}
                    />
                  </div>

                  <RadioGroup
                    value={selectedPayment}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                  >
                    <div className="space-y-3">
                      {mockPaymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`rounded-lg border-2 p-4 transition-all ${
                            selectedPayment === method.id
                              ? "border-orange-300 bg-orange-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <FormControlLabel
                            value={method.id}
                            control={<Radio sx={{ color: "orange.main" }} />}
                            label={
                              <div className="flex w-full items-start justify-between">
                                <div className="flex items-start gap-3">
                                  <method.icon className="mt-1 h-6 w-6 text-gray-600" />
                                  <div>
                                    <div className="mb-1 flex items-center gap-2">
                                      <Typography
                                        variant="subtitle1"
                                        className="font-medium"
                                      >
                                        {method.name}
                                      </Typography>
                                      {method.isRecommended && (
                                        <Chip
                                          label="Đề xuất"
                                          size="small"
                                          className="bg-orange-100 text-orange-700"
                                        />
                                      )}
                                      {method.discount && (
                                        <Chip
                                          label={`Giảm ${formatPrice(method.discount)}`}
                                          size="small"
                                          className="bg-green-100 text-green-700"
                                        />
                                      )}
                                    </div>
                                    <Typography
                                      variant="body2"
                                      className="mb-2 text-gray-600"
                                    >
                                      {method.description}
                                    </Typography>
                                    <div className="mb-2 flex items-center gap-2">
                                      <Clock className="h-3 w-3 text-gray-500" />
                                      <Typography
                                        variant="caption"
                                        className="text-gray-600"
                                      >
                                        Xử lý: {method.processingTime}
                                      </Typography>
                                    </div>
                                    {method.benefits && (
                                      <div className="flex flex-wrap gap-1">
                                        {method.benefits.map((benefit, idx) => (
                                          <Chip
                                            key={idx}
                                            label={benefit}
                                            size="small"
                                            variant="outlined"
                                            className="text-xs"
                                          />
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  {method.fee && (
                                    <Typography
                                      variant="body2"
                                      className="text-red-600"
                                    >
                                      +{formatPrice(method.fee)}
                                    </Typography>
                                  )}
                                  {method.discount && (
                                    <Typography
                                      variant="body2"
                                      className="text-green-600"
                                    >
                                      -{formatPrice(method.discount)}
                                    </Typography>
                                  )}
                                </div>
                              </div>
                            }
                            className="m-0 w-full"
                          />
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Enhanced Order Summary */}
          <div className="space-y-6">
            {/* Enhanced Voucher Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-orange-500" />
                      <Typography variant="h6" className="font-semibold">
                        Mã giảm giá
                      </Typography>
                    </div>
                    <Button
                      size="small"
                      onClick={() => setShowVoucherDialog(true)}
                      startIcon={<Eye />}
                    >
                      Xem tất cả
                    </Button>
                  </div>

                  {/* Applied Vouchers */}
                  {appliedVouchers.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {appliedVouchers.map((voucher) => (
                        <div
                          key={voucher.id}
                          className="rounded-lg border border-green-200 bg-green-50 p-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <Typography
                                variant="subtitle2"
                                className="font-semibold text-green-800"
                              >
                                {voucher.title}
                              </Typography>
                              <Typography
                                variant="caption"
                                className="text-green-600"
                              >
                                Mã: {voucher.code}
                              </Typography>
                            </div>
                            <Button
                              size="small"
                              onClick={() => handleRemoveVoucher(voucher.id)}
                              startIcon={<XCircle className="h-3 w-3" />}
                            >
                              Bỏ
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Voucher Input */}
                  <div className="flex gap-2">
                    <TextField
                      placeholder="Nhập mã giảm giá"
                      value={voucherCode}
                      onChange={(e) =>
                        setVoucherCode(e.target.value.toUpperCase())
                      }
                      size="small"
                      className="flex-1"
                      InputProps={{
                        endAdornment: voucherCode && (
                          <Tooltip title="Xóa">
                            <Button
                              size="small"
                              onClick={() => setVoucherCode("")}
                              sx={{ minWidth: "auto", p: 0.5 }}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                        ),
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleApplyVoucher}
                      disabled={!voucherCode}
                    >
                      Áp dụng
                    </Button>
                  </div>

                  {/* Quick Voucher Suggestions */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {mockVouchers.slice(0, 2).map((voucher) => (
                      <Chip
                        key={voucher.id}
                        label={voucher.code}
                        size="small"
                        onClick={() => setVoucherCode(voucher.code)}
                        className="cursor-pointer hover:bg-orange-100"
                        variant="outlined"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="sticky top-6 overflow-hidden shadow-xl">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <Typography variant="h6" className="font-semibold">
                      Tóm tắt đơn hàng
                    </Typography>
                    <Chip
                      label="Đã kiểm tra"
                      size="small"
                      className="bg-green-100 text-green-700"
                      icon={<CheckCircle className="h-3 w-3" />}
                    />
                  </div>

                  <div className="mb-6 space-y-3">
                    <div className="flex justify-between">
                      <Typography variant="body2" className="text-gray-600">
                        Tạm tính (
                        {checkoutCart.reduce(
                          (total, p) => total + p.quantity,
                          0,
                        )}{" "}
                        sản phẩm):
                      </Typography>
                      <Typography variant="body2" className="font-medium">
                        {formatPrice(subtotal)}
                      </Typography>
                    </div>

                    <div className="flex justify-between">
                      <Typography variant="body2" className="text-gray-600">
                        Phí vận chuyển:
                      </Typography>
                      <Typography variant="body2" className="font-medium">
                        {formatPrice(shippingFee)}
                      </Typography>
                    </div>

                    {paymentFee > 0 && (
                      <div className="flex justify-between">
                        <Typography variant="body2" className="text-gray-600">
                          Phí thanh toán:
                        </Typography>
                        <Typography variant="body2" className="font-medium">
                          {formatPrice(paymentFee)}
                        </Typography>
                      </div>
                    )}

                    {paymentDiscount > 0 && (
                      <div className="flex justify-between">
                        <Typography variant="body2" className="text-green-600">
                          Ưu đãi thanh toán:
                        </Typography>
                        <Typography
                          variant="body2"
                          className="font-medium text-green-600"
                        >
                          -{formatPrice(paymentDiscount)}
                        </Typography>
                      </div>
                    )}

                    {voucherDiscount > 0 && (
                      <div className="flex justify-between">
                        <Typography variant="body2" className="text-green-600">
                          Giảm giá voucher:
                        </Typography>
                        <Typography
                          variant="body2"
                          className="font-medium text-green-600"
                        >
                          -{formatPrice(voucherDiscount)}
                        </Typography>
                      </div>
                    )}

                    <Divider />

                    <div className="flex justify-between">
                      <Typography variant="h6" className="font-bold">
                        Tổng cộng:
                      </Typography>
                      <Typography
                        variant="h6"
                        className="font-bold text-orange-600"
                      >
                        {formatPrice(totalAmount)}
                      </Typography>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="mb-6 space-y-3 rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">
                        Dự kiến giao:{" "}
                        {estimatedDelivery.toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700">
                        Đảm bảo hoàn tiền 100%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-700">
                        Tích điểm thành viên
                      </span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      className="!mb-1.5 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 py-4 text-white shadow-lg hover:shadow-xl"
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      startIcon={
                        loading ? (
                          <RefreshCw className="h-5 w-5 animate-spin" />
                        ) : (
                          <Check className="h-5 w-5" />
                        )
                      }
                    >
                      {loading ? "Đang xử lý đơn hàng..." : "Đặt hàng ngay"}
                    </Button>
                  </motion.div>

                  <Typography
                    variant="caption"
                    className="mt-5 block text-center text-gray-500"
                  >
                    Bằng việc đặt hàng, bạn đồng ý với{" "}
                    <span className="cursor-pointer text-orange-600 underline">
                      Điều khoản sử dụng
                    </span>{" "}
                    và{" "}
                    <span className="cursor-pointer text-orange-600 underline">
                      Chính sách bảo mật
                    </span>
                  </Typography>

                  {/* Security Badges */}
                  <div className="mt-4 flex items-center justify-center gap-4">
                    <Tooltip title="Bảo mật SSL 256-bit">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Shield className="h-3 w-3" />
                        <span>SSL</span>
                      </div>
                    </Tooltip>
                    <Tooltip title="Thanh toán an toàn">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <CreditCard className="h-3 w-3" />
                        <span>Secure</span>
                      </div>
                    </Tooltip>
                    <Tooltip title="Đã xác minh">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <CheckCircle className="h-3 w-3" />
                        <span>Verified</span>
                      </div>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Address Dialog */}
        <AddressDialog
          isLoadingAddresses={isLoadingAddresses}
          dataAddresses={addresses}
          open={showAddressDialog}
          onClose={() => setShowAddressDialog(false)}
          selectedAddress={selectedAddress ?? addresses[0]}
          setSelectedAddress={setSelectedAddress}
        />

        {/* Enhanced Voucher Dialog */}
        <Dialog
          open={showVoucherDialog}
          onClose={() => setShowVoucherDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-orange-500" />
            Chọn voucher
          </DialogTitle>
          <DialogContent>
            <div className="space-y-3 pt-2">
              {mockVouchers.map((voucher) => (
                <motion.div
                  key={voucher.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`cursor-pointer transition-all ${
                      appliedVouchers.find((v) => v.id === voucher.id)
                        ? "border-2 border-green-300 bg-green-50"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => {
                      if (
                        !appliedVouchers.find((v) => v.id === voucher.id) &&
                        subtotal >= voucher.minOrder
                      ) {
                        setAppliedVouchers((prev) => [...prev, voucher]);
                        setNotification({
                          open: true,
                          message: `Đã áp dụng voucher ${voucher.title}!`,
                          type: "success",
                        });
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <Typography
                              variant="h6"
                              className="font-semibold text-orange-600"
                            >
                              {voucher.title}
                            </Typography>
                            {appliedVouchers.find(
                              (v) => v.id === voucher.id,
                            ) && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <Typography
                            variant="body2"
                            className="mb-2 text-gray-600"
                          >
                            {voucher.description}
                          </Typography>
                          <div className="flex items-center gap-2">
                            <Chip
                              label={voucher.code}
                              size="small"
                              className="bg-orange-100 text-orange-700"
                            />
                            <Typography
                              variant="caption"
                              className="text-gray-500"
                            >
                              HSD: {voucher.expiry.toLocaleDateString("vi-VN")}
                            </Typography>
                          </div>
                        </div>
                        <div className="text-right">
                          <Typography
                            variant="h6"
                            className="font-bold text-orange-600"
                          >
                            {voucher.type === "percentage"
                              ? `${voucher.discount}%`
                              : formatPrice(voucher.discount)}
                          </Typography>
                          <Typography
                            variant="caption"
                            className="text-gray-500"
                          >
                            Đơn tối thiểu: {formatPrice(voucher.minOrder)}
                          </Typography>
                        </div>
                      </div>
                      {subtotal < voucher.minOrder && (
                        <div className="mt-2 rounded bg-yellow-50 p-2">
                          <Typography
                            variant="caption"
                            className="text-yellow-700"
                          >
                            Mua thêm {formatPrice(voucher.minOrder - subtotal)}{" "}
                            để sử dụng voucher này
                          </Typography>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowVoucherDialog(false)}>Đóng</Button>
          </DialogActions>
        </Dialog>

        {/* Enhanced Notification */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setNotification({ ...notification, open: false })}
            severity={notification.type}
            variant="filled"
            className="shadow-lg"
            icon={
              notification.type === "success" ? (
                <CheckCircle />
              ) : notification.type === "error" ? (
                <XCircle />
              ) : notification.type === "info" ? (
                <Info />
              ) : (
                <AlertTriangle />
              )
            }
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
