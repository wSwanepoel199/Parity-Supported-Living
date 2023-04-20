import React, { useEffect, useState, Suspense, memo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Backdrop, Box, CircularProgress, Container, } from '@mui/material';
import { useRefreshUserMutation, } from './Redux/user/userApiSlice';
import { Appbar, ProtectedRoute, CustomAlert, PromptForUpdate } from "./Components";
import { SignIn, Landing, Posts, Users, Clients, Roster } from './Pages';

// inverstigate crashing when auth token expire
// Datagrid resets each time update occurs, FIX

function App() {
  const state = useSelector(state => {
    return {
      user: state.user,
      root: state.root
    };
  });
  // const rootState = useSelector(state => state.root);
  const [refreshUser] = useRefreshUserMutation();
  const [alert, setAlert] = useState(undefined);
  const [update, setUpdate] = useState(false);

  // TODO SW forced to manually unregister and reload page, look into a smoother sw transition between old and new
  // TODO Look into implimenting mailer into Backend
  // TODO remove auth token from being saved locally inorder to encourage regular refreshing, or don't, just think about it, maybe save it for next version of app

  useEffect(() => {
    // if (!mounted.current) {
    //   // if (rootState.msg?.data === "auth") {
    //   //   import('./shared/redux/user/userApiSlice')
    //   //     .then(obj => console.log(obj))
    //   //     .catch(err => console.error(err));
    //   //   // refreshUser();
    //   // }
    //   mounted.current = true;
    // }
    // if (mounted.current) {
    window.updateAvailable
      .then(isAvailable => {
        if (isAvailable) {
          setUpdate(prev => { return true; });
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

  // useEffect(() => {
  //   window.addEventListener('popstate', e => {
  //     e.preventDefault();
  //     console.log(e);
  //     window.onbeforeunload = function () { return "Don't Do That"; };
  //   });
  // }, []);

  // useEffect(() => {
  //   console.log(location);
  //   return location.listen(location => {
  //     if (location.action === 'PUSH') {
  //       setLocationKeys([location.key]);
  //     }

  //     if (location.action === "POP") {
  //       if (locationKeys[1] === location.key) {
  //         setLocationKeys(([_, ...keys]) => keys);

  //         // Handle forward event

  //       } else {
  //         setLocationKeys((keys) => [location.key, ...keys]);

  //         // Handle back event

  //       }
  //     }
  //   });
  // }, [locationKeys, location]);

  // const onBackPress = () => {
  //   const { nav, dispatch } = this.props;
  //   if (nav.index === 0) {
  //     return false;
  //   }
  //   // dispatch(NavigationActions.back());
  //   return true;
  // };

  return (
    <div className={`w-full min-h-[100dvh] bg-slate-400 flex flex-col`}>
      {/* {(mounted.current || isUninitialized) ? */}
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
                <Route path="roster" element={
                  <Roster />
                } />
              </Route>
            </Routes>
          </Container>
        </Suspense>
        {/* {process.env.NODE_ENV === 'development' ? <Button onClick={refreshUser}>Refresh</Button> : null} */}
      </>
      {/* : null} */}
    </div>
  );
}


export default memo(App);
