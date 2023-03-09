import { Box, Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useDeleteTargetUserMutation } from "../../shared/redux/admin/adminApiSlice";


const ConfirmDialog = ({ setOpenDialog, data: user }) => {
  const [deleteTargetUser] = useDeleteTargetUserMutation();

  const handleDelete = () => {
    deleteTargetUser(user);
    setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
  };

  return (
    <Box>
      <DialogTitle>Delete {user.name}?</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete {user.name}?</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button color="error" variant="contained" onClick={handleDelete}>DELETE</Button>
        <Button onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; })}>Cancel</Button>
      </DialogActions>
    </Box>
  );
};

export default ConfirmDialog;