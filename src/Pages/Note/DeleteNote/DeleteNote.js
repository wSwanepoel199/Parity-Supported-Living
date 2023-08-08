import { Backdrop, Box, Button, CircularProgress, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { memo } from "react";
import { useDeleteTargetPostMutation, } from "../../../Redux/admin/adminApiSlice";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";


const DeleteNote = () => {
  const params = useParams();
  const { setOpenDialog } = useOutletContext();
  const navigate = useNavigate();

  const [deleteTargetPost, { isLoading }] = useDeleteTargetPostMutation();

  // useEffect(() => {
  //   if (isLoading || isError) setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
  // }, [isLoading, isError, setOpenDialog]);

  const handleExit = () => {
    setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; });
    navigate('..');
  };

  const handleDelete = () => {
    deleteTargetPost(params.id).then(res => {
      handleExit();
    });
  };

  // if (isLoading) {
  //   return (
  //     <Backdrop
  //       open={true}
  //       className={`z-40`}
  //     >
  //       <CircularProgress />
  //     </Backdrop>
  //   );
  // }

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
            Delete Note?
          </Typography>
          <IconButton onClick={() => handleExit()}>
            <CloseIcon className={`interact-main`} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText className={`txt-secondary`}>Are you sure you want to delete this case note?</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'end' }}>
          <Button variant="contained" onClick={() => handleDelete()} className={`bg-transparent bg-gradient-to-b from-transparent to-psl-secondary dark:to-psl-secondary hover:bg-psl-active-link hover:to-psl-active-link hover:dark:to-psl-active-link txt-secondary hover:dark:text-psl-primary shadow-none`}>DELETE</Button>
        </DialogActions>
      </Box>
    </>
  );
};

export default memo(DeleteNote);