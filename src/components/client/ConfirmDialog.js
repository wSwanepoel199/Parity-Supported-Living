import { Box, Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useEffect } from "react";
import { useRemoveClientMutation } from "../../shared/redux/client/clientApiSlice";


const ConfirmDialog = ({ setOpenDialog, data: client }) => {
  const [removeClient, { isLoading, isError }] = useRemoveClientMutation();

  useEffect(() => {
    if (isLoading || isError) setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
  }, [isLoading, isError, setOpenDialog]);

  return (
    <Box>
      <DialogTitle>Delete {client.firstName}?</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete {client.firstName}?</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button color="error" variant="contained" onClick={() => removeClient({ clientId: client.clientId })}>DELETE</Button>
        <Button onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; })}>Cancel</Button>
      </DialogActions>
    </Box>
  );
};

export default ConfirmDialog;