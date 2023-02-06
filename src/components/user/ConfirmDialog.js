import { Box, Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useEffect } from "react";
import { useDeleteTargetUserMutation } from "../../shared/redux/admin/adminApiSlice";


const ConfirmDialog = ({ setOpenDialog, user }) => {
  const [deleteTargetUser, { isLoading, isError }] = useDeleteTargetUserMutation();

  useEffect(() => {
    if (isLoading || isError) setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
  }, [isLoading, isError, setOpenDialog]);

  return (
    <Box>
      <DialogTitle>Delete {user.name}?</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete {user.name}?</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button color="error" variant="contained" onClick={() => deleteTargetUser(user)}>DELETE</Button>
        <Button onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; })}>Cancel</Button>
      </DialogActions>
    </Box>
  );
};

export default ConfirmDialog;