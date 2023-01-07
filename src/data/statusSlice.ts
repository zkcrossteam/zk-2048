import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { endpoint, resturl }  from './endpoint';
import FormData from "form-data";
import axios from "axios";
import { ProvingTask, Task }  from "../sdk/task";


export interface StatusState {
   tasks: Array<Task>,
   loaded: boolean;
}

const initialState: StatusState = {
  tasks: [],
  loaded: false,
};


export const loadStatus = createAsyncThunk(
  'status/fetchStatus',
  async (account:string, thunkApi) => {
    let tasks = await endpoint.invokeRequest("GET", `/tasks`, JSON.parse(`{"user_address":"0x1234", "md5":"1234"}`));
    console.log("loading task board!");
    /*
    let response = await axios.get(`${resturl}/tasks`, {
        params: {},
    });
    return response["data"];
    */
    return tasks;
  }
);

export const addNewWasmImage = createAsyncThunk(
  'status/addSetupTask',
  async (formdata:FormData, thunkApi) => {
    console.log("wait response", formdata);
    let headers = { 'Content-Type': 'multipart/form-data' };
    console.log("wait response", headers);
    let response = await endpoint.invokeRequest(
      "POST",
      "/setup",
      formdata,
      headers
    );
    console.log("get response");
    return response;
  }
);

export const addProvingTask = createAsyncThunk(
  'status/addProveTask',
  async (task:ProvingTask, thunkApi) => {
    let response = await endpoint.invokeRequest(
      "POST",
      "/prove",
      JSON.parse(JSON.stringify(task))
    );
    return response;
  }
);

export const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    updateState: (state, d) => {
      state.tasks = d.payload.tasks;
      state.loaded = d.payload.loaded;
    },
    sudo: (state, d) => {

    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNewWasmImage.fulfilled, (_state, c) => {
          console.log("addImage", c.payload);
      })
      .addCase(loadStatus.fulfilled, (state, c) => {
          console.log("payload", c.payload);
          state.tasks = c.payload;
          state.loaded = true;
      });
  },
});

export const { updateState, sudo
} = statusSlice.actions;

export const selectTasks = (state:RootState) => state.status.tasks;
export const tasksLoaded = (state:RootState) => state.status.loaded;

export default statusSlice.reducer;
