import { Backdrop, Box, CircularProgress, Collapse, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, Typography } from "@mui/material";
// import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// import DoneIcon from '@mui/icons-material/Done';
// import CloseIcon from '@mui/icons-material/Close';
import Grid from "@mui/material/Unstable_Grid2/";
import { format, parseISO } from "date-fns";
import { lazy, memo, useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useGetPostQuery } from "../../../Redux/posts/postApiSlice";

const ArrowBackIosNewIcon = lazy(() => import('@mui/icons-material/ArrowBackIosNew'));
const DoneIcon = lazy(() => import('@mui/icons-material/Done'));
const CloseIcon = lazy(() => import('@mui/icons-material/Close'));

const ViewNote = () => {
  const params = useParams();
  const { data, isLoading, isFetching, isSuccess } = useGetPostQuery(params.id, { refetchOnMountOrArgChange: true });
  const mounted = useRef();
  const { setOpenDialog } = useOutletContext();

  const navigate = useNavigate();
  // const formData = JSON.parse(JSON.stringify(data).replace(/:null/gi, ":\"\""));
  const [formData, setFormData] = useState(data);
  const [open, setOpen] = useState({
    noteDetails: true,
    clientDetails: false,
    notes: false
  });

  const handleExit = () => {
    setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; });
    navigate('..', { replace: true });
  };

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
      if (mounted.current) mounted.current = false;
    };

  }, [mounted, data, isSuccess]);



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
    <>
      <Box className={`dialog-background h-full`}>
        <DialogTitle className={`flex justify-between items-center`}>
          <Typography variant="h6" component="p" className={`txt-main`}>
            Viewing Note {data?.id}
          </Typography>
          <IconButton onClick={() => handleExit()}>
            <CloseIcon className={`interact-main`} />
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
              <Typography className={`txt-main`}>Case Note Details</Typography>
              <ArrowBackIosNewIcon className={`transition group-[.noteDetails]:rotate-[-90deg] duration-100 ease-linear txt-main`} />
            </Grid>
            <Collapse
              in={open.noteDetails}
              className={`w-full max-w-90% `}
            >
              <Grid container className="border-[1px] border-slate-300 border-solid mt-[11px] p-3 m-2">
                <Grid sm={6} xs={12} className="flex justify-center">
                  <FormControl size="small" fullWidth margin="dense">
                    <InputLabel shrink htmlFor="dateInput" className="txt-secondary">Support Date</InputLabel>
                    <Typography id="dateInput" className={`p-3 txt-secondary`}>{format(parseISO(formData.date), 'yyyy/MM/dd')}</Typography>
                  </FormControl>
                </Grid>
                <Grid sm={6} xs={12} className="flex justify-center">
                  <FormControl size="small" fullWidth margin="dense">
                    <InputLabel shrink htmlFor="timeInput" className="txt-secondary">Support Duration</InputLabel>
                    <Typography id="timeInput" className={`p-3 txt-secondary`}>{formData.hours !== '' ? `${formData.hours}` : 0}</Typography>
                  </FormControl>
                </Grid>
                <Grid sm={6} xs={12} className="flex justify-center">
                  <FormControl size="small" fullWidth margin="dense">
                    <InputLabel shrink htmlFor="distanceInput" className="txt-secondary">Distance Traveled</InputLabel>
                    <Typography id="distanceInput" className={`p-3 txt-secondary`}>{formData.kilos !== '' ? `${formData.kilos}` : 0}</Typography>
                  </FormControl>
                </Grid>
                {formData.carer ? <Grid sm={6} xs={12} className="flex justify-center">
                  <FormControl size="small" fullWidth margin="dense">
                    <InputLabel shrink htmlFor="CarerInput" className="txt-secondary">Carer</InputLabel>
                    <Typography id="carerInput" className={`p-3 txt-secondary`}>{formData.carer.firstName} {formData.carer?.lastName}</Typography>
                  </FormControl>
                </Grid> : <Grid sm={6} xs={12} className="flex justify-center">
                  <FormControl size="small" fullWidth margin="dense">
                    <InputLabel shrink htmlFor="CarerInput" className="txt-secondary">Carer</InputLabel>
                    <Typography id="carerInput" className={`p-3 txt-secondary`}>{formData.carerName}</Typography>
                  </FormControl>
                </Grid>}
              </Grid>
            </Collapse>
            <Grid xs={12}
              className={`border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent flex justify-between group ${open.clientDetails && 'clientDetails'}`}
              onClick={() => setOpen(prev => {
                return {
                  ...prev,
                  clientDetails: !prev.clientDetails
                };
              })}
            >
              <Typography className={`txt-main`}>Client Details</Typography>
              {formData.client ?
                <ArrowBackIosNewIcon className={`transition group-[.clientDetails]:rotate-[-90deg] duration-100 ease-linear txt-main`} />
                : null}
            </Grid>
            {formData.client ?
              <Collapse
                in={open.clientDetails}
                className={`w-full max-w-90%`}
              >
                <Grid container className={`border-[1px] border-slate-300 border-solid mt-[11px] p-3 m-2`}>
                  <Grid sm={6} xs={12} className="flex justify-center ">
                    <FormControl size="small" fullWidth margin="dense">
                      <InputLabel shrink htmlFor="clientInput" className="txt-secondary">Client's Name</InputLabel>
                      <Typography className={`p-3 txt-secondary`}>{`${formData.client.firstName} ${formData.client?.lastName}`}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid sm={6} xs={12} className="flex justify-center">
                    <FormControl size="small" fullWidth margin="dense">
                      <InputLabel shrink htmlFor="clientInput" className="txt-secondary">Client's Email</InputLabel>
                      <Typography className={`p-3 txt-secondary`}>{`${formData.client.email}`}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid sm={6} xs={12} className="flex justify-center">
                    <FormControl size="small" fullWidth margin="dense">
                      <InputLabel shrink htmlFor="clientInput" className="txt-secondary">Client's Number</InputLabel>
                      <Typography className={`p-3 txt-secondary`}>{`${formData.client.phoneNumber}`}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid sm={6} xs={12} className="flex justify-center">
                    <FormControl size="small" fullWidth margin="dense">
                      <InputLabel shrink htmlFor="clientInput" className="txt-secondary">Client's Address</InputLabel>
                      <Typography className={`p-3 txt-secondary`}>{`${formData.client.address}`}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} className="flex justify-center">
                    <FormControl size="small" fullWidth margin="dense">
                      <InputLabel shrink htmlFor="clientInput" className="txt-secondary">Client's Details</InputLabel>
                      <Typography className={`p-3 txt-secondary`}>{`${formData.client.notes}`}</Typography>
                    </FormControl>
                  </Grid>
                </Grid>
              </Collapse> : <Grid xs={12} className="flex justify-center">
                <FormControl size="small" fullWidth margin="dense">
                  <InputLabel shrink htmlFor="clientInput" className="txt-secondary">Client's Name</InputLabel>
                  <Typography className={`p-3 txt-secondary`}>{`${formData.clientName}`}</Typography>
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
              <Typography className={`txt-main`}>Case Notes</Typography>
              <ArrowBackIosNewIcon className={`transition group-[.notes]:rotate-[-90deg] duration-100 ease-linear txt-main`} />
            </Grid>
            <Collapse
              in={open.notes}
              className={`w-full max-w-90%`}
            >
              <Grid container>
                <Grid xs={12} className="flex justify-center border-[1px] border-slate-300 border-solid mt-[11px] w-full p-3 m-2">
                  <FormControl size="small" fullWidth margin="dense" className="m-0 txt-secondary">
                    <Typography id="notesInput" className={`txt-secondary`}>{formData.notes}</Typography>
                  </FormControl>
                </Grid>
              </Grid>
            </Collapse>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', alignContent: 'space-between', alignItems: 'center', p: '20px' }}>
          <Box className={`flex justify-center content-center`}>
            <Typography className={`pr-1 txt-secondary`}>Confidential: </Typography>
            {data.private ? <DoneIcon className={`txt-main`} /> : <CloseIcon className={`txt-main`} />}
          </Box>
        </DialogActions>
      </Box>
    </>
  );
};

export default memo(ViewNote);