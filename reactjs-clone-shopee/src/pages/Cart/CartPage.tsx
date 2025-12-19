"use client";

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
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { ConfirmDialog } from "@components/Dialog";
import CartItem from "@pages/Cart/CartItem";

import {
  useAddToCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useRemoveListFromCartMutation,
} from "@redux/api/cartApi";
import { checkoutSlice } from "@redux/slices/checkoutSlice";
import { ROUTES } from "@utils/constants/route";

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ================= RTK QUERY ================= */
  const { data: cart } = useGetCartQuery(undefined);
  const cartDetails = cart?.cartDetails ?? [];

  const [addToCart, { isLoading }] = useAddToCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [removeListFromCart] = useRemoveListFromCartMutation();

  /* ================= LOCAL UI STATE ================= */
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  /* ================= DERIVED DATA (MEMOIZED) ================= */
  const selectedCartItems = useMemo(
    () => cartDetails.filter((item) => selectedItems.includes(item.id)),
    [cartDetails, selectedItems],
  );

  const totalAmount = useMemo(
    () =>
      selectedCartItems.reduce(
        (total, item) => total + item.quantity * item.product.price,
        0,
      ),
    [selectedCartItems],
  );

  /* ================= CALLBACKS ================= */
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectAll(checked);
      setSelectedItems(checked ? cartDetails.map((i) => i.id) : []);
    },
    [cartDetails],
  );

  const handleSelectItem = useCallback((id: number, checked: boolean) => {
    setSelectedItems((prev) =>
      checked ? [...prev, id] : prev.filter((itemId) => itemId !== id),
    );
    if (!checked) setSelectAll(false);
  }, []);

  const handleQuantityChange = useCallback(
    async (productId: number, newQuantity: number, currentQuantity: number) => {
      if (newQuantity < 1 || isLoading) return;

      const action = newQuantity > currentQuantity ? "INCREASE" : "DECREASE";
      const quantityDiff = Math.abs(newQuantity - currentQuantity);

      try {
        await addToCart({
          productId,
          quantity: quantityDiff,
          action,
        }).unwrap();
      } catch {
        toast.error("Update cart failed");
      }
    },
    [addToCart, isLoading],
  );

  const handleRemoveItems = useCallback(async () => {
    await removeListFromCart({ ids: selectedItems });
    setSelectedItems([]);
    setSelectAll(false);
    setConfirmOpen(false);
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
  }, [removeListFromCart, selectedItems]);

  const handleCheckout = useCallback(() => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn sản phẩm để thanh toán");
      return;
    }

    dispatch(
      checkoutSlice.actions.setCart(
        selectedCartItems.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          image: item.product.imageUrl,
          price: item.product.price,
          quantity: item.quantity,
          shop: item.product.shop.id,
        })),
      ),
    );

    navigate(ROUTES.CHECKOUT);
  }, [dispatch, navigate, selectedCartItems, selectedItems.length]);
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-orange-500" />
          <Typography variant="h4">Giỏ hàng</Typography>
          <Chip label={`${cartDetails.length} sản phẩm`} size="small" />
        </div>

        {cartDetails.length === 0 ? (
          <Typography>Giỏ hàng trống</Typography>
        ) : (
          <>
            {cartDetails.map((item) => (
              <CartItem
                formatPrice={formatPrice}
                key={item.id}
                item={item}
                selected={selectedItems.includes(item.id)}
                onSelect={handleSelectItem}
                onQuantityChange={handleQuantityChange}
                onRemove={(id) => removeFromCart({ productId: id })}
              />
            ))}

            <Card className="sticky bottom-4 mt-6">
              <CardContent className="flex items-center justify-between">
                <Checkbox
                  checked={selectAll}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <Typography fontWeight="bold">
                  Tổng: {totalAmount.toLocaleString("vi-VN")} ₫
                </Typography>
                <Button
                  variant="contained"
                  disabled={selectedItems.length === 0}
                  onClick={handleCheckout}
                >
                  Thanh toán ({selectedItems.length})
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <ConfirmDialog
        confirmOpen={confirmOpen}
        handleCancelDelete={() => setConfirmOpen(false)}
        handleRemoveItems={handleRemoveItems}
        selectedItems={selectedItems}
      />

      {selectedItems.length > 0 && (
        <Fab
          color="primary"
          className="fixed right-6 bottom-6"
          onClick={handleCheckout}
        >
          <Badge badgeContent={selectedItems.length} color="error">
            <ShoppingCart />
          </Badge>
        </Fab>
      )}
    </div>
  );
}
