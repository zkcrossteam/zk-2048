import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  ProvingParams,
  QueryParams,
  StatusState,
  WithSignature,
} from 'zkwasm-service-helper';

import { RootState } from '../app/store';
import { zkcServerClient } from './base';

const initialState: Omit<StatusState, 'config'> = {
  tasks: [],
  loaded: false,
  statistics: {
    totalImages: 0,
    totalProofs: 0,
    totalDeployed: 0,
    totalTasks: 0,
  },
};

export const loadStatus = createAsyncThunk(
  'status/fetchStatus',
  async (query: QueryParams, thunkApi) => {
    const { endpoint } = thunkApi.getState() as RootState;
    const { data } = await endpoint.zkWasmServiceHelper.loadTasks(query);

    return data;
  },
);

export const addProvingTask = createAsyncThunk(
  'status/addProveTask',
  (task: WithSignature<ProvingParams>, thunkApi) => {
    const { endpoint } = thunkApi.getState() as RootState;

    return endpoint.zkWasmServiceHelper.addProvingTask(task);
  },
);

export const addProofTask = createAsyncThunk(
  'status/addProofTask',
  async (task: WithSignature<ProvingParams>) => {
    const { body } = await zkcServerClient.post<{ uuid: string }>(
      'task/proof',
      task,
    );

    return body!;
  },
);

export const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    updateState: (state, { payload: { tasks, loaded } }) => {
      state.tasks = tasks;
      state.loaded = loaded;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadStatus.fulfilled, (state, { payload }) => {
        state.tasks = payload;
        state.loaded = true;
      })
      .addCase(addProofTask.rejected, (_, { error }) => {
        throw new Error(error?.name);
      });
  },
});

export const { updateState } = statusSlice.actions;
export const selectTasks = ({ status }: RootState) => status.tasks;
export const tasksLoaded = ({ status }: RootState) => status.loaded;
export default statusSlice.reducer;
