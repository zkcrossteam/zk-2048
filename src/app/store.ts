import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';

import accountReducer from '../data/accountSlice';
import endpointReducer from '../data/endpoint';
import statusReducer from '../data/statusSlice';
import dynamicReducer from '../dynamic/dynamicSlice';

export const store = configureStore({
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: [
          'payload.web3',
          'payload.seed',
          'payload.injector',
        ],
        ignoredPaths: [
          'acccount/fetchAccount/fulfilled',
          'account.l1Account.web3',
          'endpoint.zkWasmServiceHelper',
        ],
      },
    }),
  reducer: {
    status: statusReducer,
    dynamic: dynamicReducer,
    account: accountReducer,
    endpoint: endpointReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
