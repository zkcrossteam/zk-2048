import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import statusReducer from '../data/statusSlice';
import dynamicReducer from '../dynamic/dynamicSlice';
import accountReducer from '../data/accountSlice';
import endpointReducer from "../data/endpoint";
export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        /*
        ignoredActions: ['XXX/XXXX'],
        */
        ignoredActionPaths: ['payload.web3','payload.seed', 'payload.injector'],

        ignoredPaths: [
          "acccount/fetchAccount/fulfilled",
          "account.l1Account.web3",
          "endpoint.zkwasmTaskHelper",
          "endpoint.zkwasmImageHelper",
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
