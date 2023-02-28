import { Box, Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useEffect } from "react";
import { useDeleteTargetPostMutation, } from "../../shared/redux/admin/adminApiSlice";


const ConfirmDialog = ({ setOpenDialog, data: post }) => {
  const [deleteTargetPost, { isLoading, isError }] = useDeleteTargetPostMutation();

  useEffect(() => {
    if (isLoading || isError) setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
  }, [isLoading, isError, setOpenDialog]);

  return (
    <Box>
      <DialogTitle>Delete Note?</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete this case note?</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button color="error" variant="contained" onClick={() => deleteTargetPost(post)}>DELETE</Button>
        <Button onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; })}>Cancel</Button>
      </DialogActions>
    </Box>
  );
};

export default ConfirmDialog;