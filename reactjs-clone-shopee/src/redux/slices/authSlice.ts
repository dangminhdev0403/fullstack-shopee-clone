import { createSlice } from "@reduxjs/toolkit";
import { DataUserLogin } from "@utils/constants/types/response";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    roles: {
      name: string;
    }[];
  } | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: "",
  user: null,
};

export const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setLogin: (
      state: AuthState,
      action: {
        payload: DataUserLogin;
      },
    ) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload.access_token;
      state.user = action.payload.user;
    },
    setLogOut: () => {
      return initialState;
    },
  },
});

export const authReducer = authSlice.reducer;
