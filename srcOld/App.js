import React, { useEffect, useState, Suspense, memo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Backdrop, Box, Button, CircularProgress, Container, IconButton, Snackbar, } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRefreshUserMutation, } from './Redux/user/userApiSlice';
import { Appbar, ProtectedRoute, CustomAlert, PromptForSWUpdate, PromptForAppInstall } from "./Components";
import { SignIn, Landing, Posts, Users, Clients } from './Pages';
import reactManifest from 'react-manifest';

// inverstigate crashing when auth token expire
// Datagrid resets each time update occurs, FIX

function App() {
  const state = useSelector(state => {
    return {
      user: state.user,
      root: state.root
    };
  });
  const [refreshUser] = useRefreshUserMutation();
  const [alert, setAlert] = useState(undefined);

  // TODO SW forced to manually unregister and reload page, look into a smoother sw transition between old and new
  // TODO Look into implimenting mailer into Backend
  // TODO remove auth token from being saved locally inorder to encourage regular refreshing, or don't, just think about it, maybe save it for next version of app

  useEffect(() => {
    process.env.DEVELOPMENT === "true" && reactManifest.update({ "short_name": "PSL Notes Dev" }, "#manifest-placeholder");
  }, []);

  useEffect(() => {
    if (['error'].includes(state.root.status) && state.root.status !== "loading") {
      setAlert(prev => {
        return {
          ...prev,
          ...state.root
        };
      });
    }
    // if (['error'].includes(state.root.status) && state.root.msg.status === 403) {
    //   refreshUser();
    // }
  }, [state.root, refreshUser]);

  return (
    <div className={`w-full min-h-[100vh] flex flex-col`}>
      <>
        {/* <Backdrop
          open={state.root.status === "loading"}
          className={`z-1`}
        >
          <CircularProgress />
        </Backdrop> */}
        <Appbar />
        <CustomAlert alert={alert} />
        <Suspense fallback={
          <Box className={`flex-grow flex justify-center items-center`}>
            <CircularProgress />
          </Box>
        }>
          <PromptForSWUpdate />
          <PromptForAppInstall />
          <Container className={`flex-grow flex justify-center items-center`}>
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/" element={<Landing />}>
                <Route index element={
                  <Posts />
                } />
                <Route path="clients" element={
                  <Clients />
                } />
                <Route path="users" element={
                  <ProtectedRoute>
                    <Users />
                  </ProtectedRoute>
                } />
              </Route>
            </Routes>
          </Container>
        </Suspense>
        {/* {process.env.NODE_ENV === 'development' ? <Button onClick={refreshUser}>Refresh</Button> : null} */}
      </>
    </div>
  );
}


export default memo(App);
