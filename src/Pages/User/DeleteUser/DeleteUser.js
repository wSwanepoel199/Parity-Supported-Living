import { Box, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { memo } from "react";
import { useDeleteTargetUserMutation } from "../../../Redux/admin/adminApiSlice";
import { useNavigate, useOutletContext } from "react-router-dom";


const DeleteUser = () => {
  const [openDialog, setOpenDialog,] = useOutletContext();
  const navigate = useNavigate();
  const user = openDialog.data;

  const [deleteTargetUser] = useDeleteTargetUserMutation();

  const handleExit = () => {
    setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; });
    navigate('..');
  };

  const handleDelete = () => {
    deleteTargetUser(user).then(() => {
      handleExit();
    });
  };

  return (
    <Box>
      <DialogTitle className={`flex justify-between items-center`}>
        <Typography variant="h6" component="p">
          Delete {user.name}?
        </Typography>
        <IconButton onClick={() => handleExit()}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete {user.name}?</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button onClick={() => handleExit()}>Cancel</Button>
        <Button color="error" variant="contained" onClick={handleDelete}>DELETE</Button>
      </DialogActions>
    </Box>
  );
};

export default memo(DeleteUser);