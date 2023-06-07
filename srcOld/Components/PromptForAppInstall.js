import { Button, IconButton, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import deferredPromise from "../Helpers/deferredPromise";
import { memo, useEffect, useState } from "react";

// continue implimenting custom install button

// export const promptForInstall = new deferredPromise();

{/* <>
<Snackbar
  open={install}
  message="Install Notes"
  action={
  }
  ContentProps={{
    className: `bg-slate-500`
  }}

/>
</> */}

// const handleInstall = async () => {

//   setInstall(false);

//   deferredPrompt.prompt();

//   const { outcome } = await deferredPrompt.userChoice;

//   console.log(`User Selectec ${outcome}`);

//   setDeferredPrompt(null);
// };

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


// let displayMode = 'browser tab';
// if (window.matchMedia('(display-mode: standalone)').matches) {
//   displayMode = 'standalone';
// }
// // Log launch display mode to analytics
// console.log('DISPLAY_MODE_LAUNCH:', displayMode);

// window.matchMedia('(display-mode: standalone)').matches

const PromptForAppInstall = () => {
  const [install, setInstall] = useState(false);
  const [installEvent, setInstallEvent] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();

      // Stash the event so it can be triggered later.
      setInstallEvent(e);
      console.log(e);

      // Update UI notify the user they can install the PWA
      setInstall(true);

      // Optionally, send analytics event that PWA install promo was shown.
      console.log(`'beforeinstallprompt' event was fired.`);
    });
    window.navigator.getInstalledRelatedApps().then(res => console.log(res));

    return () => {
      window.removeEventListener("beforeinstallprompt", () => {
        console.log("no longer listening to install prompt");
      });
    };
  }, []);

  const handleInstall = () => {

  };

  const action = (
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
          // promptForInstall.resolve(false);
          setInstall(prev => !prev);
        }}
      >
        <CloseIcon />
      </IconButton>
    </>
  );


  return (
    <>
      {installEvent}
      <Snackbar
        open={install}
        message="App Available For Install"
        action={action}
      // ContentProps={{
      //   className: `bg-teal-400`
      // }}
      />
    </>
  );
};

export default memo(PromptForAppInstall);