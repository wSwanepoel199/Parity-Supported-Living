import { createSlice } from "@reduxjs/toolkit";


const isPending = (action) => {
  // console.log(action);
  // console.log(action.meta?.arg.endpointName);
  return action.type.endsWith('pending');
};

const initialState = {
  status: 'uninitiated',
  clients: []
};

export const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    saveClients: (state, action) => {
      return {
        ...state,
        status: 'success',
        clients: action.payload
      };
    },
    clearClientState: () => {
      return initialState;
    }
  },
  extraReducers(builder) {
    builder
      .addMatcher(isPending, (state, action) => {
        console.log("Client Endpoint: ", action.meta?.arg.endpointName.includes("Clients"));
        if (action.meta?.arg.endpointName.includes("Clients")) {
          console.log(action.meta?.arg.endpointName);
          return {
            ...state,
            status: 'loading'
          };
        } else {
          return;
        }
      });
  }
});

export const { saveClients, clearClientState } = clientSlice.actions;

export default clientSlice.reducer;

export const selectClients = state => state.clients;