// import axios from "axios";
// import { createAsyncThunk } from "@reduxjs/toolkit";

// import { setIsLoading } from "../reducer";
// import { AuthenticationState } from "@/interfaces";

// export const login = createAsyncThunk<
//   void | { message: string },
//   { email: string; password: string },
//   {}
// >("auth/login", async ({ email, password }, { dispatch, getState }) => {
//   const { auth: state } = getState() as { auth: AuthenticationState };
//   try {
//     dispatch(setIsLoading(true));
//     if (state.isLogin) {
//       dispatch(setIsLoading(false));
//       return { message: "You are already logged in", confirmation: false };
//     }
//     const response = (
//       await axios.post("/api/auth/login", {
//         email,
//         password,
//       })
//     ).data;
//     if (response.confirmation) {
//       dispatch(setLoggedInUser({ user: response.user as UserDocument }));
//       return { message: response.message, confirmation: response.confirmation };
//     } else {
//       dispatch(setIsLoading(false));
//       return { message: response.message, confirmation: response.confirmation };
//     }
//   } catch (e: any) {
//     console.log(e);
//     dispatch(setIsLoading(false));
//     return {
//       message: e.response.data.message || "Something went wrong",
//       confirmation: e.response.data.confirmation,
//     };
//   }
// });
