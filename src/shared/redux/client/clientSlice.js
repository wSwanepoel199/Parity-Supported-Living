import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: 'asleep'
};

export const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    saveClient: (state, action) => {
      console.log(action.payload);
    }
  },
});

export const { saveClient } = clientSlice.actions;

export default clientSlice.reducer;