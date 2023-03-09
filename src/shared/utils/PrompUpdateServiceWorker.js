import { Button, IconButton, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import deferredPromise from "./deferredPromise";

export const promptForUpdate = new deferredPromise();

const PromptForUpdate = ({ update, setUpdate }) => {

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

export default PromptForUpdate;