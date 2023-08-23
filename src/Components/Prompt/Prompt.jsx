import React from 'react';
import { Box, Fab, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UpdateIcon from '@mui/icons-material/Update';
import deferredPromise from '../../Helpers/deferredPromise';

export const promptForUpdate = new deferredPromise();

const Prompt = ({ state, close }) => {
  const { type, message, data, status } = state;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleAccept = async (type) => {
    switch (type) {
      case "install": {
        data.prompt();
        const { outcome } = await data.userChoice;
        console.log(`User Selectected ${outcome}`);
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

  return (
    <Box className='w-min flex box-border m-0 p-1'>
      {status ?
        <Tooltip title={message} placement="top" arrow classes={{ tooltip: 'text-base' }}>
          <Fab size={fullScreen ? 'small' : 'medium'} aria-label={type} onClick={() => { handleAccept(type); }} className={`bg-psl-secondary-text text-psl-primary hover:text-psl-active-link dark:bg-psl-secondary dark:text-psl-active-text hover:dark:text-psl-active-link`}>
            {type === "install" ? <DownloadIcon /> : type === 'update' ? <UpdateIcon /> : null}
          </Fab>
        </Tooltip> : null}
    </Box>
  );
};

export default Prompt;