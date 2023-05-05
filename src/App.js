import React, { useEffect, useState, Suspense, memo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Backdrop, Box, CircularProgress, Container, } from '@mui/material';
import { useRefreshUserMutation, } from './Redux/user/userApiSlice';
import { Appbar, ProtectedRoute, CustomAlert, PromptForUpdate } from "./Components";
import { SignIn, Landing, Posts, Users, Clients } from './Pages';

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
  const [update, setUpdate] = useState(false);

  // TODO SW forced to manually unregister and reload page, look into a smoother sw transition between old and new
  // TODO Look into implimenting mailer into Backend
  // TODO remove auth token from being saved locally inorder to encourage regular refreshing, or don't, just think about it, maybe save it for next version of app

  useEffect(() => {
    window.updateAvailable
      .then(isAvailable => {
        if (isAvailable) {
          setUpdate(true);
        }
      })
      .catch((err) => {
        console.error(err);
      });
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
    <div className={`w-full min-h-[100vh] bg-slate-400 flex flex-col`}>
      <>
        {state.root.status === "loading" ?
          <Backdrop
            open={state.root.status === "loading"}
            className={`z-40`}
          >
            <CircularProgress />
          </Backdrop> : null}
        {state.user.status === "loggedIn" ? <Appbar /> : null}
        <Suspense fallback={
          <Box className={`flex-grow flex justify-center items-center`}>
            <CircularProgress />
          </Box>
        }>
          <CustomAlert alert={alert} />
          <PromptForUpdate update={update} setUpdate={setUpdate} />
          <Container className={`flex-grow flex justify-center items-center`}>
            <Routes>
              <Route path="/" element={state.user.status === "loggedIn" ? <Landing /> : <SignIn />}>
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
