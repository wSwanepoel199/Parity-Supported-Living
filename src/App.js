import React, { useEffect, useState, Suspense, memo, lazy } from 'react';
import { Await, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Backdrop, Box, Button, CircularProgress, Container, IconButton, Snackbar, } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRefreshUserMutation, } from './Redux/user/userApiSlice';
import { Appbar, ProtectedRoute, CustomAlert, PromptForUpdate } from "./Components";
import { SignIn, Landing, Notes, Users, Clients } from './Pages';

// inverstigate crashing when auth token expire
// Datagrid resets each time update occurs, FIX

import {
  createRoutesFromElements
} from 'react-router-dom';

const CreateNote = lazy(() => import('./Pages/Note/CreateNote/CreateNote'));
const UpdateNote = lazy(() => import('./Pages/Note/UpdateNote/UpdateNote'));
const ViewNote = lazy(() => import('./Pages/Note/ViewNote/ViewNote'));
const DeleteNote = lazy(() => import('./Pages/Note/ConfirmDialog/ConfirmDialog'));

function App() {
  const state = useSelector(state => {
    return {
      user: state.user,
      root: state.root,
      note: state.posts
    };
  });
  const [refreshUser] = useRefreshUserMutation();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(undefined);
  const [update, setUpdate] = useState(false);
  const [install, setInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  // const htmlElement = document.documentElement;
  // localStorage.theme = document.getElementsByName("theme")[0].content;
  // htmlElement.classList.add(localStorage.theme);
  // const [themeChoice, setThemeChoice] = useState(localStorage.theme);

  // TODO SW forced to manually unregister and reload page, look into a smoother sw transition between old and new
  // TODO Look into implimenting mailer into Backend
  // TODO remove auth token from being saved locally inorder to encourage regular refreshing, or don't, just think about it, maybe save it for next version of app

  useEffect(() => {
    // process.env.DEVELOPMENT === "true" && reactManifest.update({ "short_name": "PSL Notes Dev" }, "#manifest-placeholder");

    window.updateAvailable
      .then(isAvailable => {
        if (isAvailable) {
          setUpdate(true);
        }
      })
      .catch((err) => {
        console.error(err);
      });

  }, [state.user, navigate]);

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
  //   if (htmlElement.classList.value !== localStorage.theme) {
  //     htmlElement.classList.toggle("light");
  //     htmlElement.classList.toggle("dark");
  //   }
  // }, [themeChoice]);

  // console.log(window);

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
    <div className={`w-full min-h-[100dvh] bg-slate-400 dark:bg-slate-600 flex flex-col`}>
      <>
        {/* <Backdrop
          open={state.root.status === "loading"}
          className={`z-40`}
        >
          <CircularProgress />
        </Backdrop> */}
        {/* {state.user.status === "loggedIn" ? <Appbar /> : null} */}
        <Suspense fallback={
          <Box className={`flex-grow flex justify-center items-center z-40`}>
            <CircularProgress />
          </Box>
        }>
          <Appbar />
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
          <Container className={`flex flex-grow`}>
            <Outlet />
          </Container>
        </Suspense>
        {/* {process.env.NODE_ENV === 'development' ? <Button onClick={refreshUser}>Refresh</Button> : null} */}
      </>
    </div>
  );
}

const router = createRoutesFromElements(
  <Route
    element={<App />}
  >
    <Route path="/" element={<Suspense fallback={
      <Box className={`h-full flex-grow flex justify-center items-center z-40`}>
        <CircularProgress />
      </Box>
    }>
      <Landing />
    </Suspense>
    } >
      <Route
        path="signin"
        element={<SignIn />}

      />
      <Route
        path="notes"
        element={
          <Suspense fallback={
            <Box className={`h-full flex-grow flex justify-center items-center z-40`}>
              <CircularProgress />
            </Box>
          }>
            <Notes />
          </Suspense>
        } >
        <Route
          path="new"
          element={
            <Suspense fallback={
              <Backdrop
                open={true}
                className={`z-40`}
              >
                <CircularProgress />
              </Backdrop>
            }>
              <CreateNote />
            </Suspense>
          } />
        <Route
          path="edit/:id"
          element={
            <Suspense fallback={
              <Backdrop
                open={true}
                className={`z-40`}
              >
                <CircularProgress />
              </Backdrop>
            }>
              <UpdateNote />
            </Suspense>
          } />
        <Route
          path="view/:id"
          element={
            <Suspense fallback={
              <Backdrop
                open={true}
                className={`z-40`}
              >
                <CircularProgress />
              </Backdrop>
            }>
              <ViewNote />
            </Suspense>
          } />
        <Route
          path="delete/:id"
          element={
            <Suspense fallback={
              <Backdrop
                open={true}
                className={`z-40`}
              >
                <CircularProgress />
              </Backdrop>
            }>
              <DeleteNote />
            </Suspense>
          } />
      </Route>
      <Route
        path="clients"
        element={
          <Suspense fallback={
            <Box className={`h-full flex-grow flex justify-center items-center z-40`}>
              <CircularProgress />
            </Box>
          }>
            <Clients />
          </Suspense>
        } />
      <Route
        path="users"
        element={
          <ProtectedRoute>
            <Suspense fallback={
              <Box className={`h-full flex-grow flex justify-center items-center z-40`}>
                <CircularProgress />
              </Box>
            }>
              <Users />
            </Suspense>
          </ProtectedRoute>
        } />
    </Route>
  </Route>
);

export default router;
