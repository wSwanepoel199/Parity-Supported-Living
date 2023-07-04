import React, { useEffect, useState, Suspense, memo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, Container, Fab, LinearProgress, useMediaQuery, useTheme, } from '@mui/material';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useRefreshUserMutation, } from './Redux/user/userApiSlice';
import { Appbar, CustomAlert, Prompt } from "./Components";
import { selectUser } from './Redux/user/userSlice';
import { selectRoot } from './Redux/root/rootSlice';


// inverstigate crashing when auth token expire
// impliment getUser route to redux and backend, update clients and users to use the getX route over passing data directly between components

function App() {
  const user = useSelector(selectUser);
  const root = useSelector(selectRoot);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [refreshUser] = useRefreshUserMutation();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(undefined);
  const [prompt, setPrompt] = useState({
    type: '',
    message: '',
    status: false
  });
  const [installing, setInstalling] = useState(false);
  const [install, setInstall] = useState(false);

  const deviceTheme = useMediaQuery('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem("theme");
  const classTheme = document.body.className;
  const themeIsDark = document.body.className === 'dark';
  const [selectedTheme, setSelectedTheme] = useState(document.body.className);

  if (!savedTheme) {
    deviceTheme ? localStorage.setItem('theme', 'dark') : localStorage.setItem('theme', 'light');
  }
  if (savedTheme && savedTheme !== classTheme) {
    document.body.className = savedTheme;
  }

  // TODO SW forced to manually unregister and reload page, look into a smoother sw transition between old and new
  // TODO Look into implimenting mailer into Backend
  // TODO remove auth token from being saved locally inorder to encourage regular refreshing, or don't, just think about it, maybe save it for next version of app


  useEffect(() => {
    // process.env.DEVELOPMENT === "true" && reactManifest.update({ "short_name": "PSL Notes Dev" }, "#manifest-placeholder");
    // console.log('navigator ', navigator);

    const installing = async () => {
      try {
        setInstalling(true);
        const installing = await window.installing;
        setInstalling(installing);
      }
      catch (err) {
        console.error(err);
      }
    };

    const waiting = async () => {
      try {
        const waiting = await window.waiting;
        if (waiting) setPrompt({
          message: "Update Available",
          status: waiting,
          type: 'update'
        });
      }
      catch (err) {
        console.error(err);
      }
    };

    installing();
    waiting();


    if (!sessionStorage.getItem('install')) {
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();

        // Update UI notify the user they can install the PWA
        // showInstallPromotion();
        setInstall({
          message: 'Install Notes',
          type: 'install',
          status: true,
          data: e
        });
        // Optionally, send analytics event that PWA install promo was shown.
        console.log(`'beforeinstallprompt' event was fired.`);
      });
    }

    window.addEventListener("appinstalled", () => {
      setInstall({
        message: '',
        type: '',
        status: false,
        data: null
      });

      console.log("PWA installed");
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", () => {
        console.log("removed before Install listiner");
      });

      window.removeEventListener("appinstalled", () => {
        console.log("removed app Install listiner");
      });
    };

  }, []);

  useEffect(() => {
    window.addEventListener('popstate', () => {
      if (user.status !== 'loggedIn') navigate('/signin');
    });

    return () => {
      window.removeEventListener('popstate', () => { });
    };
  }, [user.status, navigate]);

  useEffect(() => {

  }, []);

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

  const handleThemeChange = () => {
    savedTheme === 'dark' ? localStorage.setItem("theme", 'light') : localStorage.setItem('theme', 'dark');
    setSelectedTheme(localStorage.getItem('theme'));
    document.body.className = selectedTheme;
  };

  return (
    <div className={`w-full min-h-[100dvh] bg-psl-active-text dark:bg-psl-primary flex flex-col`}>
      <>
        {console.log(deviceTheme, savedTheme, classTheme, themeIsDark)}
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
          {installing && <LinearProgress className={`bg-psl-primary-text dark:bg-psl-secondary`} classes={{ bar: 'bg-psl-secondary dark:bg-psl-active-link' }} />}
          <CustomAlert alert={alert} />

          <Container className={`flex flex-grow`}>
            <Outlet />
          </Container>
          <Box className={`flex px-5 pb-4 justify-between`}>
            {(prompt.status || install.status) ?
              <div className={`flex`}>
                <Prompt type={'install'} data={install} close={setInstall} />
                <Prompt type={'update'} data={prompt} close={setPrompt} />
              </div> : null}
            <div className={`flex ml-auto p-1`}>
              <Fab size={fullScreen ? 'small' : 'medium'} aria-label="theme toggle" className={`bg-psl-secondary-text dark:bg-psl-secondary `} onClick={() => { handleThemeChange(); }}>
                {themeIsDark ? <NightsStayIcon className={`text-psl-secondary-text`} /> : <LightModeIcon className={`text-psl-primary`} />}
              </Fab>
            </div>
          </Box>
        </Suspense>
        {/* {process.env.NODE_ENV === 'development' ? <Button onClick={refreshUser}>Refresh</Button> : null} */}
      </>
    </div>
  );
}


export default memo(App);
