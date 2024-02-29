import { createSlice } from "@reduxjs/toolkit";

import { AuthenticationState } from "@/interfaces";

const initialState = () =>
  ({
    user: null,
    isLoading: false,
  } as AuthenticationState);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLoading: (state, { payload }: { payload: boolean }) => {
      state.isLoading = payload;
    },
    setUser: (state, { payload }: { payload: AuthenticationState["user"] }) => {
      state.user = payload;
    },
  },
});

export const { setIsLoading, setUser } = authSlice.actions;

export default authSlice.reducer;
