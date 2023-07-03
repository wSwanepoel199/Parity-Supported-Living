import { Backdrop, Box, Button, CircularProgress, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { memo } from "react";
import { useRemoveClientMutation } from "../../../Redux/client/clientApiSlice";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";


const DeleteClient = () => {
  const params = useParams();
  const { openDialog, setOpenDialog } = useOutletContext();
  const navigate = useNavigate();

  const [removeClient, { isLoading }] = useRemoveClientMutation();

  const handleExit = () => {
    setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; });
    navigate('..');
  };

  const handleDelete = () => {
    removeClient(params.id).then(() => {
      handleExit();
    });
  };

  return (
    <>
      <Backdrop
        open={isLoading}
        className={`z-40`}
      >
        <CircularProgress />
      </Backdrop>
      <Box>
        <DialogTitle className={`flex justify-between items-center`}>
          <Typography variant="h6" component="p">
            Delete {openDialog.data.firstName}?
          </Typography>
          <IconButton onClick={() => handleExit()}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete {openDialog.data.firstName}?</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button onClick={() => handleExit()}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>DELETE</Button>
        </DialogActions>
      </Box>
    </>
  );
};

export default memo(DeleteClient);