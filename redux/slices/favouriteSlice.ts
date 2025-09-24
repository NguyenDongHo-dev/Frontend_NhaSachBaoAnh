import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

interface FavouriteState {
  items: number[];
}

const initialState: FavouriteState = {
  items: [],
};

export const makeSelectIsFavourite = (id: number) => (state: RootState) =>
  state.favourite.items.includes(id);

const favouriteSlice = createSlice({
  name: "favourite",
  initialState,
  reducers: {
    setFavourite: (state, action: PayloadAction<number[]>) => {
      state.items = action.payload;
    },
    addFavourite: (state, action: PayloadAction<number>) => {
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload);
      }
    },
    removeFavourite: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((id) => id != action.payload);
    },
    clearFavourite: (state) => {
      state.items = [];
    },
    makeSelectIsFavourite: (state, action: PayloadAction<number>) => {},
  },
});

export const { setFavourite, addFavourite, removeFavourite, clearFavourite } =
  favouriteSlice.actions;
export default favouriteSlice.reducer;
