import { createSlice } from "@reduxjs/toolkit";
import { } from "../../Helpers/authToken";

const isPending = (action) => {
  // console.log(action);
  // console.log(action.meta?.arg.endpointName);
  return action.type.endsWith('pending');
};

const initialState = {
  status: "sleeping",
  users: undefined,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    saveUsers: (state, action) => {
      return {
        ...state,
        users: action.payload,
        status: 'success'
      };
    },
    clearUsers: () => {
      return initialState;
    }
  },
  extraReducers(builder) {
    builder
      .addMatcher(isPending, (state, action) => {
        if (action.meta?.arg.endpointName.includes("Admin")) {
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

export const { saveUsers, clearUsers } = adminSlice.actions;

export default adminSlice.reducer;

export const selectUsers = state => state.admin;