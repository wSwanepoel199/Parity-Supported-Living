import { Button, IconButton, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import deferredPromise from "./deferredPromise";
import { useEffect, useRef } from "react";
import { sendMessage } from "./api";

export const promptForUpdate = new deferredPromise();

const PromptForUpdate = ({ update, setUpdate }) => {
  const mounted = useRef();

  useEffect(() => {
    if (!mounted.current) {

      mounted.current = true;
    }

    return () => {
      mounted.current = false;
    };
  }, [mounted]);

  const handleUpdate = () => {
    // sendMessage({ type: 'SKIP_WAITING' });
    promptForUpdate.resolve(true);
    setUpdate(prev => !prev);
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
          promptForUpdate.resolve(false);
          setUpdate(prev => !prev);
        }}
      >
        <CloseIcon />
      </IconButton>
    </>
  );


  return (
    <>
      {mounted.current ?
        <Snackbar
          open={update}
          message="Update Available"
          action={action}
          ContentProps={{
            className: `bg-slate-500`
          }}
        />
        : null}
    </>
  );
};

export default PromptForUpdate;