import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface ShippingInfo {
  name: string;
  phone: string;
  address: string;
  note?: string;
}

type PaymentMethod = "COD" | "Momo" | "VNPay";

interface CheckoutState {
  cart: CartItem[];
  shippingInfo: ShippingInfo | null;
  paymentMethod: PaymentMethod;
}

const initialState: CheckoutState = {
  cart: [],
  shippingInfo: null,
  paymentMethod: "COD",
};

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<CartItem[]>) {
      state.cart = action.payload;
    },
    updateCartItem(
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) {
      const item = state.cart.find((p) => p.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    removeCartItem(state, action: PayloadAction<number>) {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
    },
    clearCart(state) {
      state.cart = [];
    },
    setShippingInfo(state, action: PayloadAction<ShippingInfo>) {
      state.shippingInfo = action.payload;
    },
    setPaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      state.paymentMethod = action.payload;
    },
    resetCheckout(state) {
      state.cart = [];
      state.shippingInfo = null;
      state.paymentMethod = "COD";
    },
  },
});

export const checkoutReducer = checkoutSlice.reducer;
