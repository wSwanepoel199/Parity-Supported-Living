import { Box, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { memo } from "react";
import { useDeleteTargetPostMutation, } from "../../shared/redux/admin/adminApiSlice";


const ConfirmDialog = ({ setOpenDialog, data: post }) => {
  const [deleteTargetPost] = useDeleteTargetPostMutation();

  // useEffect(() => {
  //   if (isLoading || isError) setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
  // }, [isLoading, isError, setOpenDialog]);

  const handleDelete = () => {
    deleteTargetPost(post);
    setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
  };

  return (
    <Box>
      <DialogTitle className={`flex justify-between items-center`}>
        <Typography variant="h6" component="p">
          Delete Note?
        </Typography>
        <IconButton onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; })}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete this case note?</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button color="error" variant="contained" onClick={handleDelete}>DELETE</Button>
        <Button onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; })}>Cancel</Button>
      </DialogActions>
    </Box>
  );
};

export default memo(ConfirmDialog);