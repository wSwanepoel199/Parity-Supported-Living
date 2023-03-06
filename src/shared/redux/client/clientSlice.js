import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: 'asleep',
  clients: []
};

export const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    saveClients: (state, action) => {
      return {
        ...state,
        status: 'fetced',
        clients: action.payload
      };
    },
    clearClientState: () => {
      return initialState;
    }
  },
});

export const { saveClients, clearClientState } = clientSlice.actions;

export default clientSlice.reducer;