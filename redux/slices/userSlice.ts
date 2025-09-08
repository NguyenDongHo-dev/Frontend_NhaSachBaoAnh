import { User } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: User | null;
  token: string;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  user: null,
  token: "",
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: any }>) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: any; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },

    logout: (state) => {
      state.user = null;
      state.token = "";
      state.isLoggedIn = false;
    },
  },
});

export const { loginSuccess, logout, setUser } = userSlice.actions;
export default userSlice.reducer;
