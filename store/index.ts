import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type {
  HoneycombState,
  AuthState,
} from './types';
import honeycombReducer from './honeycomb';
import authReducer from './auth';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { useDispatch } from 'react-redux';

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage,
    whitelist: ['auth'],
  },
  combineReducers({
    honeycomb: honeycombReducer,
    auth: authReducer,
  })
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

export const persistor = persistStore(store);

export type RootState = {
  honeycomb: HoneycombState;
  auth: AuthState;
};
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
