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
    }
  },
});

export const { saveClients } = clientSlice.actions;

export default clientSlice.reducer;