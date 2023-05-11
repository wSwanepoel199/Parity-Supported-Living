import { Button, IconButton, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { memo, useEffect, useState } from "react";

const PromptForSWUpdate = () => {
  const [update, setUpdate] = useState(false);

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

  const handleUpdate = () => {
    // sendMessage({ type: 'SKIP_WAITING' });
    // promptForUpdate.resolve(true);
    setUpdate(prev => !prev);
    window.navigator.serviceWorker.ready.then((registration) => {
      console.log("checking: ", registration);
      registration.unregister().then(() => {
        window.location.reload();
      });
    });
  };

  const action = (
    <>
      <Button
        size="small"
        onClick={handleUpdate}
        className={`text-white`}
      >
        UPDATE
      </Button>
      <IconButton
        size="small"
        aria-label='close'
        color="inherit"
        onClick={() => {
          setUpdate(prev => !prev);
        }}
      >
        <CloseIcon />
      </IconButton>
    </>
  );


  return (
    <>
      <Snackbar
        open={update}
        message="Update Available"
        action={action}
        ContentProps={{
          className: `bg-slate-500`
        }}
      />
    </>
  );
};

export default memo(PromptForSWUpdate);