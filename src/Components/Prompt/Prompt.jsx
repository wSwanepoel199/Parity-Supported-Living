import React from 'react';
import { Button, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import deferredPromise from '../../Helpers/deferredPromise';

export const promptForUpdate = new deferredPromise();

const Prompt = ({ type, data, close }) => {

  const handleAccept = async (type) => {
    switch (type) {
      case "install": {
        data.data.prompt();
        const { outcome } = await data.data.userChoice;
        console.log(`User Selectec ${outcome}`);
        close(prev => {
          return {
            ...prev,
            status: false,
          };
        });
        break;
      }
      case "update": {
        promptForUpdate.resolve(true);
        close(prev => {
          return {
            ...prev,
            status: false
          };
        });
        break;
      }
      default: {
      }
    }
  };


  const handleCancel = (type) => {
    switch (type) {
      case "install": {
        localStorage.setItem('install', false);
        close(prev => {
          return {
            ...prev,
            status: false,
            data: null
          };
        });
        break;
      }
      case "update": {
        promptForUpdate.resolve(false);
        close(prev => {
          return {
            ...prev,
            status: false
          };
        });
        break;
      }
      default: {
      }
    }
  };

  const action = (
    <>
      <Button
        size="small"
        onClick={() => handleAccept(type)}
        className={`text-white`}
      >
        {type.toUpperCase()}
      </Button>
      <IconButton
        size="small"
        aria-label='close'
        color="inherit"
        onClick={() => handleCancel(type)}
      >
        <CloseIcon />
      </IconButton>
    </>
  );

  return (
    <>
      <Snackbar
        open={Boolean(data.status)}
        message={data.message}
        action={action}
        ContentProps={{
          className: `bg-slate-500`
        }}
      />
    </>
  );
};

export default Prompt;