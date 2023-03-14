import React, { useEffect, useRef, useState, Suspense, lazy, memo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Backdrop, Box, Button, CircularProgress, Container, } from '@mui/material';
// import Dashboard from './components/Dashboard';
import ProtectedRoute from './shared/utils/ProtectedRoute';
// import PromptForUpdate from './shared/utils/PrompUpdateServiceWorker';
// import CustomAlert from './shared/utils/CustomAlert';
import { useRefreshUserMutation, } from './shared/redux/user/userApiSlice';
import Appbar from "./components/Appbar";
import SignIn from './pages/SignIn';

// inverstigate crashing when auth token expire

// import Landing from './pages/Landing';
const Landing = lazy(() => import('./pages/Landing'));
// import SignIn from './pages/SignIn';
// const SignIn = lazy(() => import('./pages/SignIn'));
// import Posts from './components/post/Posts';
const Posts = lazy(() => import('./components/post/Posts'));
// import Users from './components/user/Users';
const Users = lazy(() => import('./components/user/Users'));
// import Clients from './components/client/Client';
const Clients = lazy(() => import('./components/client/Client'));
// import CustomAlert from './shared/utils/CustomAlert';
const CustomAlert = lazy(() => import('./shared/utils/CustomAlert'));
// import PromptForUpdate from './shared/utils/PrompUpdateServiceWorker';
const PromptForUpdate = lazy(() => import('./shared/utils/PrompUpdateServiceWorker'));

function App() {
  const mounted = useRef();
  const userState = useSelector(state => state.user);
  const rootState = useSelector(state => state.root);
  const [refreshUser] = useRefreshUserMutation();
  const [alert, setAlert] = useState(undefined);
  const [update, setUpdate] = useState(false);

  // TODO SW forced to manually unregister and reload page, look into a smoother sw transition between old and new
  // TODO Look into implimenting mailer into Backend
  // TODO Look into automated backend backups, consider looking to file storage servivces to contain backups
  // TODO Impliment Client system so carers can selected a client from the drop down

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
    if (['error'].includes(rootState.status) && rootState.status !== "loading") {
      setAlert(prev => {
        return {
          ...prev,
          ...rootState
        };
      });
    }
    if (['error'].includes(rootState.status) && rootState.msg.status === 403) {
      refreshUser();
    }
  }, [rootState, refreshUser]);

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
        {rootState.status === "loading" ?
          <Backdrop
            open={rootState.status === "loading"}
            className={`z-40`}
          >
            <CircularProgress />
          </Backdrop> : null}
        {userState.status === "loggedIn" ? <Appbar /> : null}
        <Suspense fallback={
          <Box className={`flex-grow flex justify-center items-center`}>
            <CircularProgress />
          </Box>
        }>
          <CustomAlert alert={alert} />
          <PromptForUpdate update={update} setUpdate={setUpdate} />
          <Container className={`flex-grow flex justify-center items-center`}>
            <Routes>
              <Route path="/" element={userState.status === "loggedIn" ? <Landing /> : <SignIn />}>
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
      {/* : null} */}
    </div>
  );
}


export default memo(App);
