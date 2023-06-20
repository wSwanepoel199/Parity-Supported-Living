import { Box, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { memo } from "react";
import { useRemoveClientMutation } from "../../../Redux/client/clientApiSlice";
import { useNavigate, useOutletContext } from "react-router-dom";


const DeleteClient = () => {
  const [openDialog, setOpenDialog,] = useOutletContext();
  const navigate = useNavigate();
  const client = openDialog.data;

  const [removeClient] = useRemoveClientMutation();

  const handleExit = () => {
    setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; });
    navigate('..');
  };

  const handleDelete = () => {
    removeClient({ clientId: client.clientId }).then(() => {
      handleExit();
    });
  };

  return (
    <Box>
      <DialogTitle className={`flex justify-between items-center`}>
        <Typography variant="h6" component="p">
          Delete {client.firstName}?
        </Typography>
        <IconButton onClick={() => handleExit()}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete {client.firstName}?</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button onClick={() => handleExit()}>Cancel</Button>
        <Button color="error" variant="contained" onClick={handleDelete}>DELETE</Button>
      </DialogActions>
    </Box>
  );
};

export default memo(DeleteClient);