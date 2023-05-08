import React, { useEffect, useState, Suspense, memo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Backdrop, Box, Button, CircularProgress, Container, IconButton, Snackbar, } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
  const [install, setInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

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

  // useEffect(() => {
  //   window.addEventListener('beforeinstallprompt', (e) => {
  //     // Prevent the mini-infobar from appearing on mobile
  //     e.preventDefault();
  //     // Stash the event so it can be triggered later.
  //     setDeferredPrompt(e);

  //     console.log(deferredPrompt);
  //     // Update UI notify the user they can install the PWA
  //     // showInstallPromotion();
  //     setInstall(true);
  //     // Optionally, send analytics event that PWA install promo was shown.
  //     console.log(`'beforeinstallprompt' event was fired.`);
  //   });

  //   window.addEventListener("appinstalled", () => {
  //     setInstall(false);

  //     setDeferredPrompt(null);

  //     console.log("PWA installed");
  //   });

  //   return () => {
  //     window.removeEventListener("beforeinstallprompt", () => {
  //       console.log("removed before Install listiner");
  //     });

  //     window.removeEventListener("appinstalled", () => {
  //       console.log("removed app Install listiner");
  //     });
  //   };
  // }, []);



  const handleInstall = async () => {

    setInstall(false);

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User Selectec ${outcome}`);

    setDeferredPrompt(null);
  };

  return (
    <div className={`w-full min-h-[100vh] bg-slate-400 flex flex-col`}>
      <>
        <Backdrop
          open={state.root.status === "loading"}
          className={`z-40`}
        >
          <CircularProgress />
        </Backdrop>
        {state.user.status === "loggedIn" ? <Appbar /> : null}
        <Suspense fallback={
          <Box className={`flex-grow flex justify-center items-center`}>
            <CircularProgress />
          </Box>
        }>
          <CustomAlert alert={alert} />
          <PromptForUpdate update={update} setUpdate={setUpdate} />
          <>
            <Snackbar
              open={install}
              message="Install Notes"
              action={
                <>
                  <Button
                    size="small"
                    onClick={handleInstall}
                    className={`text-white`}
                  >
                    Install
                  </Button>
                  <IconButton
                    size="small"
                    aria-label='close'
                    color="inherit"
                    onClick={() => {
                      // promptForUpdate.resolve(false);
                      setDeferredPrompt(null);
                      setInstall(prev => !prev);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </>
              }
              ContentProps={{
                className: `bg-slate-500`
              }}

            />
          </>
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
