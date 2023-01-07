import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DelphinusWeb3, withBrowerWeb3 } from "web3subscriber/src/client";

export interface L1AccountInfo {
  address: string;
  chainId: string;
  web3: any;
}

async function loginL1Account() {
  return await withBrowerWeb3(async (web3: DelphinusWeb3) => {
    let i = await web3.getAccountInfo();
    return i;
  });
}


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
  async (thunkApi) => {
    let account = await loginL1Account();
    return account;
  }
);

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setL1Account: (state, account) => {
      state.l1Account!.address = account.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginL1AccountAsync.pending, (state) => {
        state.status = 'Loading';
      })
      .addCase(loginL1AccountAsync.fulfilled, (state, c) => {
        state.status = 'Ready';
        console.log(c);
        state.l1Account = c.payload;
      })

  },
});

export const selectL1Account = <T extends State>(state: T) => state.account.l1Account;
export const selectLoginStatus = <T extends State>(state: T) => state.account.status;

export default accountSlice.reducer;
