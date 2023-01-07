import { createSlice} from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { addNewWasmImage, addProvingTask } from '../data/statusSlice';

export interface PanelState {
  dialog: Array<string>;
  waitingForResponse: boolean;
}

const initialState: PanelState = {
  dialog: [],
  waitingForResponse: false,
};

export const panelSlice = createSlice({
  name: 'panel',
  initialState,
  reducers: {
  }
});
