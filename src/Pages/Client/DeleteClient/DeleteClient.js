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
    navigate('..', { replace: true });
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
      <Box className={`dialog-background h-full`}>
        <DialogTitle className={`flex justify-between items-center`}>
          <Typography variant="h6" component="p" className={`txt-main`}>
            Delete {openDialog.data.firstName} {openDialog.data?.lastName}?
          </Typography>
          <IconButton onClick={() => handleExit()}>
            <CloseIcon className={`interact-main`} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText className={`txt-secondary`}>Are you sure you want to delete {openDialog.data.firstName} {openDialog.data?.lastName}?</DialogContentText>
        </DialogContent>
        <DialogActions className="justify-end">
          <Button variant="contained" onClick={handleDelete} className={`bg-transparent bg-gradient-to-b from-transparent to-psl-secondary dark:to-psl-secondary hover:bg-psl-active-link hover:to-psl-active-link hover:dark:to-psl-active-link txt-secondary hover:dark:text-psl-primary shadow-none`}>DELETE</Button>
        </DialogActions>
      </Box>
    </>
  );
};

export default memo(DeleteClient);