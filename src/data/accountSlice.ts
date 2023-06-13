import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { withBrowerWeb3 } from 'web3subscriber/src/client';

import { switchNet } from './chainNet';

export interface L1AccountInfo extends Record<'address' | 'chainId', string> {
  web3: any;
}

const loginL1Account = async () => {
  const accountInfo = await withBrowerWeb3(async web3 => {
    switchNet(web3);
    return web3.getAccountInfo();
  });

  localStorage.account = accountInfo.address;
  return accountInfo;
};

export interface AccountState {
  l1Account?: L1AccountInfo;
  status: 'Loading' | 'Ready';
  localStorageAccount: string;
}

export interface State {
  account: AccountState;
}

const initialState: AccountState = {
  status: 'Loading',
  l1Account: {
    address: '',
    chainId: '',
    web3: null,
  },
  localStorageAccount: localStorage.account || '',
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const loginL1AccountAsync = createAsyncThunk(
  'acccount/fetchAccount',
  loginL1Account,
);

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setL1Account: (state, { payload }) => {
      state.l1Account!.address = payload;
    },
    setLocalStorageAccount: (state, { payload }) => {
      state.localStorageAccount = payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginL1AccountAsync.pending, state => {
        state.status = 'Loading';
      })
      .addCase(loginL1AccountAsync.fulfilled, (state, { payload }) => {
        state.status = 'Ready';
        state.l1Account = payload;
        state.localStorageAccount = payload.address;
      });
  },
});

export const { setL1Account, setLocalStorageAccount } = accountSlice.actions;

export const selectL1Account = <T extends State>({
  account: { l1Account },
}: T) => l1Account;
export const selectLoginStatus = <T extends State>({
  account: { status },
}: T) => status;
export const selectLocalStorageAccount = <T extends State>({
  account: { localStorageAccount },
}: T) => localStorageAccount;

export default accountSlice.reducer;
