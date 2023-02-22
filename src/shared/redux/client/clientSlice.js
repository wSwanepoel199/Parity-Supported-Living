import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: 'asleep',
  clients: []
};

export const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    saveClients: (state, action) => {
      console.log(action.payload);
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