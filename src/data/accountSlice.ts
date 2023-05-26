import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { withBrowerWeb3 } from 'web3subscriber/src/client';

export interface L1AccountInfo extends Record<'address' | 'chainId', string> {
  web3: any;
}

const loginL1Account = () => withBrowerWeb3(web3 => web3.getAccountInfo());

export interface AccountState {
  l1Account?: L1AccountInfo;
  status: 'Loading' | 'Ready';
}

export interface State {
  account: AccountState;
}

const initialState: AccountState = {
  status: 'Loading',
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
  },
  extraReducers: builder => {
    builder
      .addCase(loginL1AccountAsync.pending, state => {
        state.status = 'Loading';
      })
      .addCase(loginL1AccountAsync.fulfilled, (state, { payload }) => {
        state.status = 'Ready';
        state.l1Account = payload;
      });
  },
});

export const selectL1Account = <T extends State>({
  account: { l1Account },
}: T) => l1Account;
export const selectLoginStatus = <T extends State>({
  account: { status },
}: T) => status;

export default accountSlice.reducer;
