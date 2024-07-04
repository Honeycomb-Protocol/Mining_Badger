import { createAsyncThunk } from "@reduxjs/toolkit";
import { HoneycombActionsWithoutThunk } from "../honeycomb";
import type { HoneycombState } from "../types";
import type { AsyncActions } from "../actions/types.js";

import { AuthActionsWithoutThunk } from ".";

const actionFactory = (actions: AsyncActions) => {
  const logout = createAsyncThunk<boolean, void>(
    "honeycomb/logout",
    async (
      isAuth,
      { rejectWithValue, fulfillWithValue, dispatch, getState }
    ) => {
      try {
        const { wallet } = (getState() as { honeycomb: HoneycombState })
          .honeycomb;
        dispatch(AuthActionsWithoutThunk.clearAuthData());
        dispatch(HoneycombActionsWithoutThunk.clearUser());
        dispatch(HoneycombActionsWithoutThunk.clearProfile());
        dispatch(HoneycombActionsWithoutThunk.clearUserApiCalled());
        dispatch(HoneycombActionsWithoutThunk.clearProfileApiCalled());

        // let userExists = false;

        // if (!isAuth) {
        //   userExists = await identity
        //     .walletResolver(ForceScenario.Force)
        //     .then((user) => {
        //       console.log("WalletResolved", user);
        //       if (!user) return false;
        //       return true;
        //     })
        //     .catch((e) => {
        //       console.log("Error resolving wallet:", e);
        //       return false;
        //       // console.error("Error resolving wallet:", e);
        //     });
        // }

        // if (isAuth || userExists) {
        //   setTimeout(async () => {
        //     await dispatch(actions.honeycomb.loadIdentityDeps("switch"));
        //   }, 1000);
        // }
        return fulfillWithValue(true);
      } catch (error) {
        console.error("Error in logging out:", error);
        throw rejectWithValue(error);
      }
    }
  );
  return {
    logout,
  };
};
export default actionFactory;
