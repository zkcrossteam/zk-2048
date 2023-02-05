import {
  ZkWasmServiceTaskHelper,
  ZkWasmServiceImageHelper,
} from "zkwasm-service-helper";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, store } from "../app/store";

export const resturl = "http://zkwasm-explorer.delphinuslab.com:8080";
export const zkwasmTaskHelper = new ZkWasmServiceTaskHelper(resturl, "", "");
export const zkwasmImageHelper = new ZkWasmServiceImageHelper(resturl, "", "");
export interface Endpoint {
  url: string;
  nickname: string;
}

export const storageKey = "customURLs";
export const defaultEndpoint: Endpoint = {
  url: resturl,
  nickname: "Default",
};
function customEndpoints() {
  //Get custom endpoint array from local storage
  let endpoints = localStorage.getItem(storageKey);
  if (endpoints) {
    return JSON.parse(endpoints) as Endpoint[];
  }
  return [];
}

function getLastUsedEndpoint() {
  let endpoint = localStorage.getItem("lastUsedEndpoint");
  if (endpoint) {
    console.log("last used endpoint: " + endpoint + "");
    return JSON.parse(endpoint) as Endpoint;
  }
  return defaultEndpoint;
}

const initialState: {
  zkwasmTaskHelper: ZkWasmServiceTaskHelper;
  zkwasmImageHelper: ZkWasmServiceImageHelper;
  currentEndpoint: Endpoint;
  endpointList: Endpoint[];
} = {
  zkwasmTaskHelper: new ZkWasmServiceTaskHelper(
    getLastUsedEndpoint().url,
    "",
    ""
  ),
  zkwasmImageHelper: new ZkWasmServiceImageHelper(
    getLastUsedEndpoint().url,
    "",
    ""
  ),
  currentEndpoint: getLastUsedEndpoint(),
  endpointList: [...customEndpoints()],
};

export const endpointSlice = createSlice({
  name: "endpoint",
  initialState,
  reducers: {
    updateCurrentEndpoint: (state, d: PayloadAction<Endpoint>) => {
      //add updated array to local storage
      localStorage.setItem("lastUsedEndpoint", JSON.stringify(d.payload));
      state.currentEndpoint = d.payload;
      state.zkwasmTaskHelper = new ZkWasmServiceTaskHelper(
        d.payload.url,
        "",
        ""
      );
      state.zkwasmImageHelper = new ZkWasmServiceImageHelper(
        d.payload.url,
        "",
        ""
      );
    },
    setEndpointList: (state, d) => {
      //add updated array to local storage
      localStorage.setItem(storageKey, JSON.stringify(d.payload));
      state.endpointList = d.payload;
    },
  },
});

export const { updateCurrentEndpoint, setEndpointList } = endpointSlice.actions;

export const selectEndpointList = (state: RootState) =>
  state.endpoint.endpointList;
export const selectCurrentEndpoint = (state: RootState) =>
  state.endpoint.currentEndpoint;
export const selectZkWasmTaskHelper = (state: RootState) =>
  state.endpoint.zkwasmTaskHelper;
export const selectZkWasmImageHelper = (state: RootState) =>
  state.endpoint.zkwasmImageHelper;

export default endpointSlice.reducer;




