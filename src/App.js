import React, { useEffect, useState, Suspense, memo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Button, CircularProgress, Container, IconButton, Snackbar, } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRefreshUserMutation, } from './Redux/user/userApiSlice';
import { Appbar, CustomAlert, PromptForUpdate } from "./Components";
import { selectUser } from './Redux/user/userSlice';
import { selectRoot } from './Redux/root/rootSlice';


// inverstigate crashing when auth token expire
// impliment getUser route to redux and backend, update clients and users to use the getX route over passing data directly between components

function App() {
  const user = useSelector(selectUser);
  const root = useSelector(selectRoot);
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

  }, [user, navigate]);

  useEffect(() => {
    if (['error'].includes(root.status) && root.status !== "loading") {
      setAlert(prev => {
        return {
          ...prev,
          ...root
        };
      });
    }
    // if (['error'].includes(state.root.status) && state.root.msg.status === 403) {
    //   refreshUser();
    // }
  }, [root, refreshUser]);

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
    <div className={`w-full min-h-[100dvh] bg-psl-active-text dark:bg-psl-primary flex flex-col`}>
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


export default memo(App);
