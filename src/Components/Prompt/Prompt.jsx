import React from 'react';
import { Box, Button, Container, Fab, IconButton, Snackbar, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import UpdateIcon from '@mui/icons-material/Update';
import deferredPromise from '../../Helpers/deferredPromise';

export const promptForUpdate = new deferredPromise();

const Prompt = ({ type, data, close }) => {

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
        sessionStorage.setItem('install', false);
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
    <Box className='w-min flex box-border m-0 p-1'>
      {/* <Snackbar
        open={Boolean(data.status)}
        message={data.message}
        action={action}
        ContentProps={{
          className: `bg-slate-500`
        }}
      /> */}
      {data.status ?
        <Tooltip title={data.message} placement="top" arrow classes={{ tooltip: 'text-base' }}>
          <Fab size={fullScreen ? 'small' : 'medium'} aria-label={type} onClick={() => { handleAccept(type); }} className={`bg-psl-secondary-text text-psl-primary hover:text-psl-active-link dark:bg-psl-secondary dark:text-psl-active-text hover:dark:text-psl-active-link`}>
            {type === "install" ? <DownloadIcon /> : type === 'update' ? <UpdateIcon /> : null}
          </Fab>
        </Tooltip> : null}
    </Box>
  );
};

export default Prompt;