import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
  stock: number;
}

interface CartState {
  items: CartItem[];
  err: string;
  total: number;
  shipping: number;
  totalItmes: number;
  lengthItmes: number;
}

const initialState: CartState = {
  items: [],
  err: "",
  total: 0,
  shipping: 0,
  totalItmes: 0,
  lengthItmes: 0,
};

const calculateTotals = (state: CartState) => {
  state.lengthItmes = state.items.length;

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  state.totalItmes = subtotal;
  state.total = subtotal + state.shipping;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.err = "";
      calculateTotals(state);
    },
    addItem: (state, action: PayloadAction<CartItem>) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (index !== -1) {
        const currentQty = state.items[index].quantity;
        const newQty = currentQty + action.payload.quantity;

        if (newQty > action.payload.stock) {
          state.err = "Số lượng vượt quá tồn kho.";
          state.items[index].quantity = action.payload.stock;
        } else {
          state.items[index].quantity = newQty;
          state.err = "";
        }
      } else {
        if (action.payload.quantity > action.payload.stock) {
          state.items.push({
            ...action.payload,
            quantity: action.payload.stock,
          });
          state.err = "Số lượng vượt quá tồn kho.";
        } else {
          state.items.push(action.payload);
          state.err = "";
        }
      }
      calculateTotals(state);
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.err = "";
      calculateTotals(state);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        if (action.payload.quantity > item.stock) {
          item.quantity = item.stock;
          state.err = "Số lượng vượt quá tồn kho.";
        } else {
          item.quantity = action.payload.quantity;
          state.err = "";
        }
      }
      calculateTotals(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.err = "";
      calculateTotals(state);
    },

    clearError: (state) => {
      state.err = "";
    },

    updateShip: (state, action) => {
      state.shipping = action.payload;
      calculateTotals(state);
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  setCart,
  updateShip,
} = cartSlice.actions;
export default cartSlice.reducer;
