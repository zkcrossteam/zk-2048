import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface SysEvent {}

export interface DynamicState {
  events: SysEvent[];
}

const initialState: DynamicState = {
  events: [],
};

export const updateDynamic = createAsyncThunk(
  'dynamic/updateDynamicState',
  (account: string, thunkApi) => '',
);

export const dynamicSlice = createSlice({
  name: 'dynamic',
  initialState,
  reducers: {
    setTasksList: (state, d) => {},
  },
  extraReducers: builder =>
    builder.addCase(updateDynamic.fulfilled, (meta: DynamicState, c) => {}),
});

export const { setTasksList } = dynamicSlice.actions;

export default dynamicSlice.reducer;
