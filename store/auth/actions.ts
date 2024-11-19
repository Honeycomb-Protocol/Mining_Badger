import { createAsyncThunk } from "@reduxjs/toolkit";
import { useHoneycombAuth } from "@honeycomb-protocol/profile-hooks";

import { AuthActionsWithoutThunk } from ".";

const actionFactory = () => {
  const logout = createAsyncThunk<boolean, void>(
    "honeycomb/logout",
    async (_, { rejectWithValue, fulfillWithValue, dispatch }) => {
      try {
        const { logout } = useHoneycombAuth();
        dispatch(AuthActionsWithoutThunk.clearAuthData());
        logout();
        return fulfillWithValue(true);
      } catch (error) {
        console.error("Error while logging out:", error);
        throw rejectWithValue(error);
      }
    }
  );
  return {
    logout,
  };
};
export default actionFactory;
