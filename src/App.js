import React, { useEffect, useState, Suspense, memo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, Container, Fab, LinearProgress, useMediaQuery, useTheme, } from '@mui/material';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import LightModeIcon from '@mui/icons-material/LightMode';
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

  const navigate = useNavigate();

  const [installing, setInstalling] = useState(undefined);
  const [waiting, setWaiting] = useState({
    message: '',
    type: '',
    status: false,
    data: null
  });
  const [install, setInstall] = useState({
    message: '',
    type: '',
    status: false,
    data: null
  });

  const deviceTheme = useMediaQuery('(prefers-color-scheme: dark)'); //true
  const [darkMode, setDarkMode] = useState(deviceTheme); //true
  const savedTheme = localStorage.getItem("theme"); //null

  if (!savedTheme) { //(true && true) = true
    localStorage.setItem('theme', darkMode ? 'dark' : 'light'); //theme = dark
  }
  if (savedTheme && savedTheme !== document.body.className) { //(true && true) = true
    document.body.className = savedTheme; // dark
  }

  // TODO Look into implimenting mailer into Backend
  // TODO remove auth token from being saved locally inorder to encourage regular refreshing, or don't, just think about it, maybe save it for next version of app


  useEffect(() => {
    // process.env.DEVELOPMENT === "true" && reactManifest.update({ "short_name": "PSL Notes Dev" }, "#manifest-placeholder");
    // console.log('navigator ', navigator);

    const sw_is_installing = async () => {
      try {
        setInstalling(process.env.NODE_ENV === "production");
        const installing = await window.installing;
        setInstalling(installing);
      }
      catch (err) {
        console.error(err);
      }
    };

    const sw_is_waiting = async () => {
      try {
        const waiting = await window.waiting;
        if (waiting) setWaiting({
          message: "Update Available",
          status: waiting,
          type: 'update'
        });
      }
      catch (err) {
        console.error(err);
      }
    };

    sw_is_installing();
    sw_is_waiting();


    // event listener to control pwa installation
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
    });

    // event listener to clear installation event
    window.addEventListener("appinstalled", () => {
      setInstall({
        message: '',
        type: '',
        status: false,
        data: null
      });

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


  // console.log(window);

  const handleThemeChange = () => {
    darkMode ? localStorage.setItem('theme', 'light') : localStorage.setItem('theme', 'dark'); // theme = light
    setDarkMode(!darkMode); //false
    document.body.className = localStorage.getItem('theme'); // class = light
  };

  return (
    <div className={`w-full min-h-[100dvh] bg-psl-active-text dark:bg-psl-primary flex flex-col`}>
      <>
        <Suspense fallback={
          <Box className={`flex-grow flex justify-center items-center z-40`}>
            <CircularProgress />
          </Box>
        }>
          <Appbar />
          {installing && <LinearProgress className={`bg-psl-primary-text dark:bg-psl-secondary`} classes={{ bar: 'bg-psl-secondary dark:bg-psl-active-link' }} />}
          <CustomAlert />

          <Container className={`flex flex-grow`}>
            <Outlet />
          </Container>
          <Box className={`flex px-5 pb-4 justify-between`}>
            <div className={`flex`}>
              <Prompt state={install} close={setInstall} />
              <Prompt state={waiting} close={setWaiting} />
            </div>
            <div className={`flex ml-auto p-1`}>
              <Fab size={fullScreen ? 'small' : 'medium'} aria-label="theme toggle" className={`bg-psl-secondary-text dark:bg-psl-secondary `} onClick={() => { handleThemeChange(); }}>
                {darkMode ? <NightsStayIcon className={`text-psl-secondary-text`} /> : <LightModeIcon className={`text-psl-primary`} />}
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
