import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import themeReducer from './slices/themeSlice';
import userReducer from './slices/authSlice';
import apiErrorReducer from './slices/apiErrorSlice';
import configReducer from './slices/configSlice';


const persistConfig = {
  key: 'auth',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    auth:     persistedAuthReducer,
    theme:    themeReducer,
    apiError: apiErrorReducer,
    config:   configReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});


export const persistor = persistStore(store);