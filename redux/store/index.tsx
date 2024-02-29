// import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import { setupListeners } from "@reduxjs/toolkit/query";
// import { useDispatch } from "react-redux";
// import storage from "redux-persist/lib/storage";
// import {
//   FLUSH,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
//   REHYDRATE,
//   persistReducer,
//   persistStore,
// } from "redux-persist";

// const persistConfig = {
//   key: "root",
//   version: 1,
//   storage,
//   whitelist: ["auth"], // List of reducers you want to persist
// };

// // Use combineReducers to combine reducers
// const rootReducer = combineReducers({
//   auth: authReducer,
// });
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }).concat(UserApi.middleware),
// });

// export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch;

// // optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// // see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
// setupListeners(store.dispatch);
// export const useAppDispatch = () => useDispatch<AppDispatch>();

// export default store;
