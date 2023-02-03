import React, { useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import Dashboard from './components/Dashboard';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import { useRefreshUserMutation, } from './shared/redux/user/userSlice';
import Posts from './components/post/Posts copy';
import Users from './components/user/Users copy';
import ProtectedRoute from './shared/utils/ProtectedRoute';
import { Alert, AlertTitle, Backdrop, CircularProgress, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { clearMessage } from './shared/redux/root/rootSlice';
import PromptForUpdate from './shared/utils/PrompUpdateServiceWorker';

function App() {
  const mounted = useRef();
  const userState = useSelector(state => state.user);
  const rootState = useSelector(state => state.root);
  const dispatch = useDispatch();
  const [refreshUser, { isUninitialized, }] = useRefreshUserMutation();
  const [alert, setAlert] = useState(undefined);
  const [update, setUpdate] = useState(false);

  // TODO SW forced to manually unregister and reload page, look into a smoother sw transition between old and new
  // TODO Look into implimenting mailer into Backend
  // TODO Look into automated backend backups, consider looking to file storage servivces to contain backups

  useEffect(() => {
    if (!mounted.current) {
      if (rootState.msg?.data === "auth") {
        refreshUser();
      }
      mounted.current = true;
    }
    if (mounted.current) {
      window.updateAvailable
        .then(isAvailable => {
          if (isAvailable) {
            setUpdate(prev => { return true; });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }


    return () => {
      mounted.current = false;
    };
  }, [mounted, userState.status, refreshUser, setUpdate, rootState.msg]);

  useEffect(() => {
    if (['error'].includes(rootState.status) && rootState.status !== "loading") {
      setAlert(prev => {
        return {
          ...prev,
          ...rootState
        };
      });
    }
  }, [rootState]);


  return (
    <div className={`w-full min-h-screen bg-slate-400 flex flex-col justify-center items-center`}>
      {(mounted.current || isUninitialized) ?
        <>
          <Backdrop
            open={rootState.status === "loading"}
            className={`z-30`}
          >
            <CircularProgress />
          </Backdrop>
          <Collapse
            in={['error'].includes(rootState.status)}
            unmountOnExit
            className={`absolute z-50 left-0 top-0 w-full`}
          >
            {alert ?
              <Alert
                className={`flex items-center`}
                severity={alert.status}
                action={
                  <IconButton
                    aria-label="close"
                    color='inherit'
                    onClick={() => {
                      dispatch(clearMessage());
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>}

              >
                <AlertTitle>{alert.msg.status} {alert.msg.statusText}</AlertTitle>
                {(alert.msg.message)}
              </Alert>
              : null}
          </Collapse>
          <PromptForUpdate update={update} setUpdate={setUpdate} />
          <Routes>
            <Route path="/" element={userState.status === "loggedIn" ? <Landing /> : <SignIn />}>
              <Route index element={
                <Posts />
              } />
              <Route path="users" element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </>
        : null}
    </div>
  );
}


export default App;
