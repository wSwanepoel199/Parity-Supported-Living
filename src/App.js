import React, { useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Backdrop, CircularProgress, } from '@mui/material';
// import Dashboard from './components/Dashboard';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import Posts from './components/post/Posts';
import Users from './components/user/Users';
import Clients from './components/client/Client';
import ProtectedRoute from './shared/utils/ProtectedRoute';
import PromptForUpdate from './shared/utils/PrompUpdateServiceWorker';
import CustomAlert from './shared/utils/CustomAlert';
import { useRefreshUserMutation, } from './shared/redux/user/userApiSlice';

function App() {
  const mounted = useRef();
  const userState = useSelector(state => state.user);
  const rootState = useSelector(state => state.root);
  const [refreshUser, { isUninitialized, }] = useRefreshUserMutation();
  const [alert, setAlert] = useState(undefined);
  const [update, setUpdate] = useState(false);

  // TODO SW forced to manually unregister and reload page, look into a smoother sw transition between old and new
  // TODO Look into implimenting mailer into Backend
  // TODO Look into automated backend backups, consider looking to file storage servivces to contain backups
  // TODO Impliment Client system so carers can selected a client from the drop down

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
    <div className={`w-full min-h-screen bg-slate-400 flex flex-col justify-center items-center`}>
      {console.log(process.env.PUBLIC_URL)}
      {(mounted.current || isUninitialized) ?
        <>
          <Backdrop
            open={rootState.status === "loading"}
            className={`z-40`}
          >
            <CircularProgress />
          </Backdrop>
          <CustomAlert alert={alert} />
          <PromptForUpdate update={update} setUpdate={setUpdate} />
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
        </>
        : null}
    </div>
  );
}


export default App;
