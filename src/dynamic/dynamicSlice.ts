import { createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface SysEvent {
}

export interface DynamicState {
    events: Array<SysEvent>;
}

const initialState: DynamicState = {
    events: [],
}


export const updateDynamic = createAsyncThunk(
  'dynamic/updateDynamicState',
  async (account:string, thunkApi) => {
    return "";
  }
);

function timeout(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export const dynamicSlice = createSlice({
  name: 'dynamic',
  initialState,
  reducers: {
    setTasksList: (state, d) => {
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateDynamic.fulfilled, (meta: DynamicState, c) => {
      })

  },
});
export const {setTasksList} = dynamicSlice.actions;
export default dynamicSlice.reducer;
