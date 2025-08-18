"use client";

import { ConfirmDialog } from "@components/Dialog";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Fab,
  Typography,
} from "@mui/material";
import CartItem from "@pages/Cart/CartItem";
import {
  CartDetailDTO,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useRemoveListFromCartMutation,
} from "@redux/api/cartApi";
import { cartSilice } from "@redux/slices/cartSlice";
import { checkoutSlice } from "@redux/slices/checkoutSlice";
import { RootState } from "@redux/store";
import { ROUTES } from "@utils/constants/route";
import { Delete, ShoppingBag, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

interface CartDTO {
  id: number;
  cartDetails: CartDetailDTO[];
}
export default function CartPage() {
  const cart: CartDTO = useSelector(
    (state: RootState) =>
      (state.api.queries["getCart(undefined)"]?.data as CartDTO) ?? {
        id: 0,
        cartDetails: [],
      },
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [addToCart, { isLoading }] = useAddToCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [removeListFromCart] = useRemoveListFromCartMutation();
  const selectedProductIdStore = useSelector(
    (state: RootState) => state.cart.selectedProductId,
  );
  const cartDetails = cart.cartDetails || [];
  const selectedItem = cartDetails.find(
    (item) => item.id === selectedProductIdStore,
  );
  const otherItems = [...cartDetails]
    .reverse()
    .filter((item) => item.id !== selectedProductIdStore);
  useEffect(() => {
    if (selectedProductIdStore != null) {
      const idSlected = cart.cartDetails
        .filter((item) => item.product.id === selectedProductIdStore)
        .map((item) => item.id);
      setSelectedItems(idSlected);
      dispatch(cartSilice.actions.clearSelectedProduct());
    }
  }, [cart.cartDetails, dispatch, selectedProductIdStore]);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedItems(checked ? cart.cartDetails.map((i) => i.id) : []);
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    setSelectedItems((prev) =>
      checked ? [...prev, id] : prev.filter((itemId) => itemId !== id),
    );
    if (!checked) setSelectAll(false);
  };

  const handleQuantityChange = async (
    productId: number,
    newQuantity: number,
    currentQuantity: number,
  ) => {
    if (newQuantity < 1 || isLoading) return;

    const action = newQuantity > currentQuantity ? "INCREASE" : "DECREASE";
    const quantityDiff = Math.abs(newQuantity - currentQuantity);

    try {
      await addToCart({
        productId,
        quantity: quantityDiff,
        action,
      }).unwrap();
      // Không cần cập nhật state thủ công — RTK Query refetch giỏ hàng tự động
    } catch (err) {
      console.error("Update cart failed:", err);
      toast.error("Update cart failed:");
    }
  };

  const handleRemoveItem = (id: number) => {
    removeFromCart({ productId: id });
  };
  const handleRemoveItems = () => {
    removeListFromCart({ ids: selectedItems });
    setSelectedItems([]);
    setSelectAll(false);
    setConfirmOpen(false);
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng.");
  };
  const openConfirmDialog = () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để xóa.");
      return;
    }
    setConfirmOpen(true);
  };
  const handleCancelDelete = () => {
    setConfirmOpen(false);
  };
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const selectedCartItems = cart.cartDetails.filter((item) =>
    selectedItems.includes(item.id),
  );

  const totalAmount = selectedCartItems.reduce(
    (total, item) => total + item.quantity * item.product.price,
    0,
  );

  const totalItems = selectedCartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }
    const selectedCartItemsForCheckout = selectedCartItems.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      image: item.product.imageUrl,
      price: item.product.price,
      quantity: item.quantity,
      shop: item.product.shop.id,
    }));

    dispatch(checkoutSlice.actions.setCart(selectedCartItemsForCheckout));

    // Navigate to checkout page with selected items
    navigate(ROUTES.CHECKOUT, { state: { selectedItems } });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Page Header */}
        <div className="mb-6 flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-orange-500" />
          <Typography variant="h4" className="font-bold text-gray-800">
            Giỏ hàng của bạn
          </Typography>
          <Chip
            label={`${cart.cartDetails.length} sản phẩm`}
            color="primary"
            size="small"
          />
        </div>

        {cart.cartDetails.length > 0 ? (
          <>
            {/* Cart Header */}
            <Card className="mb-4 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      sx={{ color: "orange.main" }}
                    />
                    <Typography variant="h6" className="font-semibold">
                      Sản phẩm
                    </Typography>
                  </div>
                  <div className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
                    <span className="w-20 text-center">Đơn giá</span>
                    <span className="w-24 text-center">Số lượng</span>
                    <span className="w-24 text-center">Thành tiền</span>
                    <span className="w-12"></span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cart Items */}
            <div className="space-y-4">
              {/* Nếu có sản phẩm được chọn bởi "Mua ngay", render nó trước */}
              {selectedItem && (
                <CartItem
                  key={selectedItem.id}
                  item={selectedItem}
                  selected={selectedItems.includes(selectedItem.id)}
                  onSelect={handleSelectItem}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                  formatPrice={formatPrice}
                />
              )}

              {/* Render phần còn lại */}
              {otherItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  selected={selectedItems.includes(item.id)}
                  onSelect={handleSelectItem}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                  formatPrice={formatPrice}
                />
              ))}
            </div>

            {/* Checkout Section */}
            <Card className="sticky bottom-4 mt-6 shadow-2xl">
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left Side - Selection Controls */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectAll}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        sx={{ color: "orange.main" }}
                      />
                      <Typography>
                        Chọn tất cả ({cart.cartDetails.length})
                      </Typography>
                    </div>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Delete />}
                      onClick={openConfirmDialog}
                    >
                      Xóa
                    </Button>
                  </div>

                  {/* Right Side - Total & Checkout */}
                  <div className="flex flex-col items-end gap-4 sm:flex-row sm:items-center">
                    <div className="text-right">
                      <Typography
                        variant="body2"
                        className="font-medium text-gray-600 lg:!text-2xl"
                      >
                        Tổng thanh toán :
                      </Typography>
                      <Typography
                        variant="h5"
                        className="font-bold text-orange-600"
                      >
                        {formatPrice(totalAmount)}
                      </Typography>
                    </div>
                    <Button
                      variant="contained"
                      size="large"
                      disabled={selectedItems.length === 0}
                      className={`bg-gradient-to-r from-orange-500 to-red-500 px-8 py-3 !text-white shadow-lg hover:from-orange-600 hover:to-red-600 ${
                        selectedItems.length === 0
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                      startIcon={<ShoppingCart />}
                      onClick={handleCheckout}
                    >
                      Mua hàng ({selectedItems.length})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Empty Cart State */
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gray-100">
                <ShoppingCart className="h-16 w-16 text-gray-400" />
              </div>
              <Typography
                variant="h5"
                className="mb-4 font-semibold text-gray-800"
              >
                Giỏ hàng của bạn còn trống
              </Typography>
              <Typography variant="body1" className="mb-8 text-gray-600">
                Hãy chọn thêm sản phẩm để mua sắm nhé!
              </Typography>
              <Button
                variant="contained"
                size="large"
                className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-3 text-white shadow-lg"
                startIcon={<ShoppingBag />}
                onClick={() => navigate(ROUTES.HOME)}
              >
                Khám phá sản phẩm
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Floating Action Button for Mobile */}
        {selectedItems.length > 0 && (
          <Fab
            color="primary"
            className="fixed right-6 bottom-6 bg-orange-500 hover:bg-orange-600 lg:hidden"
            onClick={() => {
              /* Handle checkout */
            }}
          >
            <Badge badgeContent={selectedItems.length} color="error">
              <ShoppingCart />
            </Badge>
          </Fab>
        )}
      </div>
      <ConfirmDialog
        confirmOpen={confirmOpen}
        handleCancelDelete={handleCancelDelete}
        handleRemoveItems={handleRemoveItems}
        selectedItems={selectedItems}
      />
    </div>
  );
}
