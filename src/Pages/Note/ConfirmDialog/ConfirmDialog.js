import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { memo } from "react";
import { useDeleteTargetPostMutation, } from "../../../Redux/admin/adminApiSlice";
import { useNavigate, useOutletContext } from "react-router-dom";


const ConfirmDialog = () => {
  const [openDialog, setOpenDialog, fullScreen] = useOutletContext();
  const navigate = useNavigate();
  const post = openDialog.data;

  const [deleteTargetPost] = useDeleteTargetPostMutation();

  // useEffect(() => {
  //   if (isLoading || isError) setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
  // }, [isLoading, isError, setOpenDialog]);

  const handleDelete = () => {
    deleteTargetPost(post);
    setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
    navigate('..');
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={openDialog.open}
      className={`z-30 max-w-full`}
    >
      <Box>
        <DialogTitle className={`flex justify-between items-center`}>
          <Typography variant="h6" component="p">
            Delete Note?
          </Typography>
          <IconButton onClick={() => {
            setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; });
            navigate('..');
          }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this case note?</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button color="error" variant="contained" onClick={handleDelete}>DELETE</Button>
          <Button onClick={() => {
            setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
            navigate('..');
          }}>Cancel</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default memo(ConfirmDialog);