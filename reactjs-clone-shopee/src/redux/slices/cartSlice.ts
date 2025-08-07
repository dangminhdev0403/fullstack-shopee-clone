import { createSlice } from "@reduxjs/toolkit";

interface CartState {
  selectedProductId: number | null;
}
const initialState: CartState = {
  selectedProductId: null,
};
export const cartSilice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart(state, action) {
      state.selectedProductId = action.payload.id;
    },
    clearSelectedProduct(state) {
      state.selectedProductId = null;
    },
  },
});

export const cartReducer = cartSilice.reducer;
