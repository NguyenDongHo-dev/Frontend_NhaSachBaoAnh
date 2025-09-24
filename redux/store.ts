import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./slices/userSlice";
import cartReducer from "./slices/cartSlice";
import favouriteReducer from "./slices/favouriteSlice";

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["user", "isLoggedIn"],
};

const cartPersistConfig = {
  key: "cart",
  storage,
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  cart: persistReducer(cartPersistConfig, cartReducer),
  favourite: favouriteReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// Type cho hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
