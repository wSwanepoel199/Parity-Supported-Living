import React, { useEffect, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import Dashboard from './components/Dashboard';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import { fetchStoredTokenLocal, fetchStoredTokenSession } from './shared/utils/authToken';
import { useRefreshUserMutation, } from './shared/redux/user/userSlice';
import Posts from './components/post/Posts';
import Users from './components/user/Users';
import ProtectedRoute from './shared/utils/ProtectedRoute';
import { Alert, AlertTitle, Backdrop, CircularProgress, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { clearError } from './shared/redux/root/rootSlice';

function App() {
  const mounted = useRef();
  const userState = useSelector(state => state.user);
  const rootState = useSelector(state => state.root);
  const dispatch = useDispatch();
  const [refreshUser, { isUninitialized, }] = useRefreshUserMutation();

  useEffect(() => {
    if (!mounted.current) {
      if (userState.status === "loggedOut" && (fetchStoredTokenLocal() || fetchStoredTokenSession())) refreshUser();
      mounted.current = true;
    }
    return () => {
      mounted.current = false;
    };
  }, [mounted, userState.status, refreshUser]);

  // TODO: improve error handler by allowing it to collapse in and out, considering adding thirdparty to control

  return (
    <div className='w-full min-h-screen bg-slate-400 flex flex-col justify-center items-center'>
      {(mounted.current || isUninitialized) ?
        <>
          <Backdrop
            open={rootState.status === "loading"}
            className={`z-30`}
          >
            <CircularProgress />
          </Backdrop>
          <Collapse
            in={rootState.status === "error"}
            unmountOnExit
            className={`absolute z-50 left-0 top-0 w-full`}
          >
            <Alert
              className={`flex items-center`}
              severity={rootState.status}
              action={
                <IconButton
                  aria-label="close"
                  color='inherit'
                  onClick={() => {
                    dispatch(clearError());
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>}

            >
              {rootState.error ? <>
                <AlertTitle>{rootState.error.status}</AlertTitle>
                {rootState.error.data.message}
              </> : null}
            </Alert>
          </Collapse>
          <Routes>
            <Route path="/" element={userState.status === "loggedIn" ? <Landing /> : <SignIn />}>
              <Route index element={
                <Posts />
                // <Dashboard />
              } />
              {/* <Route path="notes" element={<Posts />} /> */}
              <Route path="/users" element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </>
        : null}
    </div >
  );
}


export default App;
