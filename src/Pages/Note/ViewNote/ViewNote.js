import { Backdrop, Box, Button, CircularProgress, Collapse, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, Typography } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import Grid from "@mui/material/Unstable_Grid2/";
import { format, parseISO } from "date-fns";
import { memo, useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useGetPostQuery } from "../../../Redux/posts/postApiSlice";

const ViewNote = () => {
  const params = useParams();
  const { data, isLoading, isFetching, isSuccess } = useGetPostQuery(params.id, { refetchOnMountOrArgChange: true });
  const mounted = useRef();
  const [openDialog, setOpenDialog] = useOutletContext();

  const navigate = useNavigate();
  // const formData = JSON.parse(JSON.stringify(data).replace(/:null/gi, ":\"\""));
  const [formData, setFormData] = useState(data);
  const [open, setOpen] = useState({
    noteDetails: true,
    clientDetails: false,
    notes: false
  });

  useEffect(() => {
    if (isSuccess && !mounted.current) {
      setFormData(prev => {
        return {
          ...prev,
          ...JSON.parse(JSON.stringify(data).replace(/:null/gi, ":\"\""))
        };
      });
      mounted.current = true;
    }

    return () => {
      if (mounted.current) {
        mounted.current = false;
      }
    };

  }, [mounted, data, isSuccess]);

  const handleExit = () => {
    setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; });
    navigate('..');
  };

  if (isLoading || isFetching || !mounted.current) {
    return (
      <Backdrop
        open={true}
        className={`z-40`}
      >
        <CircularProgress />
      </Backdrop>
    );
  }


  return (
    <Box>
      <DialogTitle className={`flex justify-between items-center`}>
        <Typography variant="h6" component="p">
          Viewing Note {data.id}
        </Typography>
        <IconButton onClick={() => handleExit()}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} className="flex justify-center">
          <Grid xs={12}
            className={`border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent flex justify-between group ${open.noteDetails && 'noteDetails'}`}
            onClick={() => setOpen(prev => {
              return {
                ...prev,
                noteDetails: !prev.noteDetails
              };
            })}
          >
            <Typography>Case Note Details</Typography>
            <ArrowBackIosNewIcon className={`transition group-[.noteDetails]:rotate-[-90deg] duration-100 ease-linear`} />
          </Grid>
          <Collapse
            in={open.noteDetails}
            className={`
              w-[90%]
              `}
          >
            <Grid container spacing={2} className="flex justify-center border-[1px] border-slate-300 border-solid mt-[11px]">
              <Grid sm={6} xs={12} className="flex justify-center">
                <FormControl size="small" fullWidth margin="dense">
                  <InputLabel shrink htmlFor="dateInput" >Support Date</InputLabel>
                  <Typography id="dateInput" className={`p-3`}>{format(parseISO(formData.date), 'yyyy-MM-dd')}</Typography>
                </FormControl>
              </Grid>
              <Grid sm={6} xs={12} className="flex justify-center">
                <FormControl size="small" fullWidth margin="dense">
                  <InputLabel shrink htmlFor="timeInput">Support Duration</InputLabel>
                  <Typography id="timeInput" className={`p-3`}>{formData.hours !== '' ? `${formData.hours}` : 0}</Typography>
                </FormControl>
              </Grid>
              <Grid sm={6} xs={12} className="flex justify-center">
                <FormControl size="small" fullWidth margin="dense">
                  <InputLabel shrink htmlFor="distanceInput">Distance Traveled</InputLabel>
                  <Typography id="distanceInput" className={`p-3`}>{formData.kilos !== '' ? `${formData.kilos}` : 0}</Typography>
                </FormControl>
              </Grid>
              {formData.carer ? <Grid sm={6} xs={12} className="flex justify-center">
                <FormControl size="small" fullWidth margin="dense">
                  <InputLabel shrink htmlFor="CarerInput">Carer</InputLabel>
                  <Typography id="carerInput" className={`p-3`}>{formData.carer.firstName} {formData.carer?.lastName}</Typography>
                </FormControl>
              </Grid> : <Grid sm={6} xs={12} className="flex justify-center">
                <FormControl size="small" fullWidth margin="dense">
                  <InputLabel shrink htmlFor="CarerInput">Carer</InputLabel>
                  <Typography id="carerInput" className={`p-3`}>{formData.carerName}</Typography>
                </FormControl>
              </Grid>}
            </Grid>
          </Collapse>
          <Grid xs={12}
            className={`
          border-b-2
          border-b-gray-400
          border-solid
          border-x-transparent
          border-t-transparent
          flex
          justify-between
          group ${open.clientDetails && 'clientDetails'}`}
            onClick={() => setOpen(prev => {
              return {
                ...prev,
                clientDetails: !prev.clientDetails
              };
            })}
          >
            <Typography>Client Details</Typography>
            {formData.client ?
              <ArrowBackIosNewIcon className={`transition group-[.clientDetails]:rotate-[-90deg] duration-100 ease-linear`} />
              : null}
          </Grid>
          {formData.client ?
            <Collapse
              in={open.clientDetails}
              className={`
              w-[90%]
              `}
            >
              <Grid container className={`border-[1px] border-slate-300 border-solid mt-[11px]`}>
                <Grid sm={6} xs={12} className="flex justify-center ">
                  <FormControl size="small" fullWidth margin="dense">
                    <InputLabel shrink htmlFor="clientInput">Client's Name</InputLabel>
                    <Typography className={`p-3`}>{`${formData.client.firstName} ${formData.client?.lastName}`}</Typography>
                  </FormControl>
                </Grid>
                <Grid sm={6} xs={12} className="flex justify-center">
                  <FormControl size="small" fullWidth margin="dense">
                    <InputLabel shrink htmlFor="clientInput">Client's Email</InputLabel>
                    <Typography className={`p-3`}>{`${formData.client.email}`}</Typography>
                  </FormControl>
                </Grid>
                <Grid sm={6} xs={12} className="flex justify-center">
                  <FormControl size="small" fullWidth margin="dense">
                    <InputLabel shrink htmlFor="clientInput">Client's Number</InputLabel>
                    <Typography className={`p-3`}>{`${formData.client.phoneNumber}`}</Typography>
                  </FormControl>
                </Grid>
                <Grid sm={6} xs={12} className="flex justify-center">
                  <FormControl size="small" fullWidth margin="dense">
                    <InputLabel shrink htmlFor="clientInput">Client's Address</InputLabel>
                    <Typography className={`p-3`}>{`${formData.client.address}`}</Typography>
                  </FormControl>
                </Grid>
                <Grid xs={12} className="flex justify-center">
                  <FormControl size="small" fullWidth margin="dense">
                    <InputLabel shrink htmlFor="clientInput">Client's Details</InputLabel>
                    <Typography className={`p-3`}>{`${formData.client.notes}`}</Typography>
                  </FormControl>
                </Grid>
              </Grid>
            </Collapse> : <Grid xs={12} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel shrink htmlFor="clientInput">Client's Name</InputLabel>
                <Typography className={`p-3`}>{`${formData.clientName}`}</Typography>
              </FormControl>
            </Grid>}
          <Grid xs={12}
            className={`border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent flex justify-between group ${open.notes && 'notes'}`}
            onClick={() => setOpen(prev => {
              return {
                ...prev,
                notes: !prev.notes
              };
            })}
          >
            <Typography>Case Notes</Typography>
            <ArrowBackIosNewIcon className={`transition group-[.notes]:rotate-[-90deg] duration-100 ease-linear`} />
          </Grid>
          <Collapse
            in={open.notes}
            className={`
            w-full
              max-w-90%
              `}
          >
            <Grid container>
              <Grid xs={12} className="flex justify-center border-[1px] border-slate-300 border-solid mt-[11px] w-full">
                <FormControl size="small" fullWidth margin="dense">
                  <Typography id="notesInput" className={``}>{formData.notes}</Typography>
                </FormControl>
              </Grid>
            </Grid>
          </Collapse>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', alignContent: 'space-between', alignItems: 'center', px: '20px' }}>
        <Box className={`flex justify-center content-center`}>
          <Typography className={`pr-1`}>Confidential: </Typography>
          {data.private ? <DoneIcon /> : <CloseIcon />}
        </Box>
        <Box>
          <Button onClick={() => handleExit()}>Close</Button>
        </Box>
      </DialogActions>
    </Box >
  );
};

export default memo(ViewNote);