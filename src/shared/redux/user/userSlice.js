import { createSlice } from "@reduxjs/toolkit";
import { fetchStoredTokenLocal, removeStoredTokenLocal, removeStoredTokenSession, storeAuthTokenLocal, storeAuthTokenSession } from "../../utils/authToken";

const initialState = {
  status: (sessionStorage.getItem("USER_DETAILS") || localStorage.getItem("USER_DETAILS")) ? "loggedIn" : 'loggedOut',
  user: JSON.parse(sessionStorage.getItem("USER_DETAILS") || localStorage.getItem("USER_DETAILS")) || {},
  error: undefined,
  intervalId: null,
  icon: JSON.parse(sessionStorage.getItem("USER_DETAILS") || localStorage.getItem("USER_DETAILS"))?.icon
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveUser: (state, action) => {
      const { user, rememberMe } = action.payload;
      const name = `${user.firstName} ${user.lastName || ''}`;
      const { accessToken, ...loggedinUser } = user;
      if (rememberMe) {
        accessToken && storeAuthTokenLocal(accessToken);
        localStorage.setItem('USER_DETAILS', JSON.stringify(loggedinUser));
      } else {
        accessToken && storeAuthTokenSession(accessToken);
        sessionStorage.setItem("USER_DETAILS", JSON.stringify(loggedinUser));
      }
      return {
        ...state,
        status: "loggedIn",
        user: { ...loggedinUser, name: name },
        icon: loggedinUser.icon
      };
    },
    signOutUser: (state) => {
      return {
        ...state,
        status: 'signingOut'
      };
    },
    removeUser: (state) => {
      if (fetchStoredTokenLocal()) {
        localStorage.removeItem("USER_DETAILS");
        removeStoredTokenLocal();
      } else {
        sessionStorage.removeItem("USER_DETAILS");
        removeStoredTokenSession();
      }
      clearInterval(state.intervalId);
      return {
        status: 'loggedOut',
        user: {},
        intervalId: null,
        icon: undefined
      };
    },
    saveRefreshInterval: (state, action) => {
      return {
        ...state,
        intervalId: action.payload
      };
    },
    updateStatus: (state, action) => {
      return {
        ...state,
        status: action.payload
      };
    }
  },
});

export const { saveUser, removeUser, signOutUser, saveRefreshInterval, updateStatus } = userSlice.actions;

export default userSlice.reducer;
