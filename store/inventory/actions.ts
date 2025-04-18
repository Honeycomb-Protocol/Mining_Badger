import { createAsyncThunk } from "@reduxjs/toolkit";

import { InventoryActionsWithoutThunk } from ".";
import { AsyncActions } from "../actions/types";

const actionFactory = (actions: AsyncActions) => {
  const logout = createAsyncThunk<boolean, void>(
    "honeycomb/logout",
    async (_, { rejectWithValue, fulfillWithValue, dispatch }) => {
      try {
        dispatch(InventoryActionsWithoutThunk.clearInventoryData());
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
