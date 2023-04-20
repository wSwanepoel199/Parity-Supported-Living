import { Box, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { memo } from "react";
import { useRemoveClientMutation } from "../../../Redux/client/clientApiSlice";


const ConfirmDialog = ({ setOpenDialog, data: client }) => {
  const [removeClient] = useRemoveClientMutation();

  const handleDelete = () => {
    removeClient({ clientId: client.clientId });
    setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
  };

  return (
    <Box>
      <DialogTitle className={`flex justify-between items-center`}>
        <Typography variant="h6" component="p">
          Delete {client.firstName}?
        </Typography>
        <IconButton onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; })}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete {client.firstName}?</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button color="error" variant="contained" onClick={handleDelete}>DELETE</Button>
        <Button onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; })}>Cancel</Button>
      </DialogActions>
    </Box>
  );
};

export default memo(ConfirmDialog);