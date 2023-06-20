import { Box, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { memo } from "react";
import { useDeleteTargetPostMutation, } from "../../../Redux/admin/adminApiSlice";
import { useNavigate, useOutletContext } from "react-router-dom";


const DeleteNote = () => {
  const [openDialog, setOpenDialog,] = useOutletContext();
  const navigate = useNavigate();
  const post = openDialog.data;

  const [deleteTargetPost] = useDeleteTargetPostMutation();

  // useEffect(() => {
  //   if (isLoading || isError) setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
  // }, [isLoading, isError, setOpenDialog]);

  const handleExit = () => {
    setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; });
    navigate('..');
  };

  const handleDelete = () => {
    deleteTargetPost(post).then(res => {
      handleExit();
    });
  };

  return (
    <Box>
      <DialogTitle className={`flex justify-between items-center`}>
        <Typography variant="h6" component="p">
          Delete Note?
        </Typography>
        <IconButton onClick={() => handleExit()}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete this case note?</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button onClick={() => handleExit()}>Cancel</Button>
        <Button color="error" variant="contained" onClick={handleDelete}>DELETE</Button>
      </DialogActions>
    </Box>
  );
};

export default memo(DeleteNote);