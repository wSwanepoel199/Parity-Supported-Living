import { Backdrop, Box, CircularProgress, Collapse, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, Stack, Typography } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CloseIcon from '@mui/icons-material/Close';
import Grid from "@mui/material/Unstable_Grid2/";
import { memo, useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useGetClientQuery } from "../../../Redux/client/clientApiSlice";


const ViewClient = () => {

  const params = useParams();
  const mounted = useRef();
  const { data, isLoading, isFetching, isSuccess } = useGetClientQuery(params.id, { refetchOnMountOrArgChange: true });
  const { setOpenDialog } = useOutletContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(data);

  const [open, setOpen] = useState({
    clientDetails: true,
    carersDetails: false,
    notesDetails: false
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
      if (mounted.current) mounted.current = false;
    };
  }, [mounted, data, isSuccess]);

  const handleExit = () => {
    setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
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
    <Box className={`dialog-background h-full`}>
      <DialogTitle className={`flex justify-between items-center`}>
        <Typography variant="h6" component="p" className={`txt-main`}>
          Viewing Client {data?.firstName} {data?.lastName}
        </Typography>
        <IconButton onClick={() => handleExit()}>
          <CloseIcon className={`interact-main`} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} className="flex justify-center">
          <Grid xs={12}
            className={` border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent flex justify-between group ${open.clientDetails && 'clientDetails'}`}
            onClick={() => setOpen(prev => {
              return {
                ...prev,
                clientDetails: !prev.clientDetails
              };
            })}
          >
            <Typography className={`txt-main`}>{formData.name}'s Details</Typography>
            <ArrowBackIosNewIcon className={`txt-main transition group-[.clientDetails]:rotate-[-90deg] duration-100 ease-linear`} />
          </Grid>
          <Collapse
            in={open.clientDetails}
            className={`w-full max-w-[90%]`}
          >
            <Grid container className={`border-[1px] border-slate-300 border-solid mt-[11px] p-3 m-2`}>
              <Grid sm={6} xs={12} className="flex justify-center">
                <FormControl size="small" fullWidth margin="dense">
                  <InputLabel shrink htmlFor="clientName" className="txt-secondary">Name</InputLabel>
                  <Typography id="clientName" className={`p-3 txt-secondary`}>{formData.name}</Typography>
                </FormControl>
              </Grid>
              <Grid sm={6} xs={12} className="flex justify-center">
                <FormControl size="small" fullWidth margin="dense">
                  <InputLabel shrink htmlFor="clientPhoneNumber" className="txt-secondary">Phone Number</InputLabel>
                  <Typography id="clientPhoneNumber" className={`p-3 txt-secondary`}>{formData.phoneNumber}</Typography>
                </FormControl>
              </Grid>
              <Grid sm={6} xs={12} className="flex justify-center">
                <FormControl size="small" fullWidth margin="dense">
                  <InputLabel shrink htmlFor="clientEmail" className="txt-secondary">Email</InputLabel>
                  <Typography id="clientEmail" className={`p-3 txt-secondary`}>{formData.email}</Typography>
                </FormControl>
              </Grid>
              <Grid sm={6} xs={12} className="flex justify-center ">
                <FormControl size="small" fullWidth margin="dense">
                  <InputLabel shrink htmlFor="clientsAddress" className="txt-secondary">Address</InputLabel>
                  <Typography id="clientsAddress" className={`p-3 txt-secondary`}>{formData.address}</Typography>
                </FormControl>
              </Grid>
              <Grid xs={12} className="flex justify-center">
                <FormControl size="small" fullWidth margin="dense">
                  <InputLabel shrink htmlFor="notes" className="txt-secondary">Details</InputLabel>
                  <Typography id="notes" className={`p-3 pb-0 txt-secondary`}>{formData.notes}</Typography>
                </FormControl>
              </Grid>
            </Grid>
          </Collapse>
          <Grid xs={12}
            className={`border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent flex justify-between group ${open.carersDetails && 'carersDetails'}`}
            onClick={() => setOpen(prev => {
              return {
                ...prev,
                carersDetails: !prev.carersDetails
              };
            })}
          >
            <Typography className="txt-main">Carers Details</Typography>
            {formData.carers ?
              <ArrowBackIosNewIcon className={`transition group-[.carersDetails]:rotate-[-90deg] duration-100 ease-linear txt-main`} />
              : null}
          </Grid>
          {formData.carers ?
            <Collapse
              in={open.carersDetails}
              className={`w-full max-w-[90%]`}
            >
              <Stack className={`divide-y divide-x-0 divide-slate-300 divide-solid border-[1px] border-slate-300 border-solid mt-[11px] m-2`}>
                {formData.carers.map((carer, index) => {
                  return (
                    <Grid container key={index} className={`flex justify-between flex-wrap py-3 sm:px-3`}>
                      <Grid sm={6} xs={12} className="flex justify-center">
                        <FormControl size="small" fullWidth margin="dense" >
                          <InputLabel shrink htmlFor="carerName" className="txt-secondary">Carer</InputLabel>
                          <Typography id="carerName" className={`p-3 pb-0 txt-secondary`}>{`${carer.firstName} ${carer?.lastName}`}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid sm={6} xs={12} className="flex justify-center">
                        <FormControl size="small" fullWidth margin="dense" >
                          <InputLabel shrink htmlFor="carerEmail" className="txt-secondary">Carer's Email</InputLabel>
                          <Typography id="carerEmail" className={`p-3 pb-0 txt-secondary`}>{`${carer.email}`}</Typography>
                        </FormControl>
                      </Grid>
                    </Grid>
                  );
                })}
              </Stack>
            </Collapse> : null}
          {/* <Grid xs={12}
            className=" border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent flex justify-between"
            onClick={() => setOpen(prev => {
              return {
                ...prev,
                notesDetails: !prev.notesDetails
              };
            })}
          >
            <Typography>Case Notes</Typography>
            {open.notesDetails ? <ArrowBackIosNewIcon className={`rotate-[-90deg]`} /> : <ArrowBackIosNewIcon />}
          </Grid>
          <Collapse
            in={open.notesDetails}
            className={`
              w-[90%]
              `}
          >
            <Stack className={`divide-y divide-x-0 divide-slate-300 divide-solid border-[1px] border-slate-300 border-solid mt-[11px]`}>
              {formData.posts.map((note, index) => {
                const user = users.find(user => user.userId === note.carerId);
                if (user) return (
                  <Grid container spacing={0.5} key={index} className="flex justify-center">
                    <Grid sm={6} xs={12} className="flex justify-center">
                      <FormControl size="small" fullWidth margin="dense">
                        <InputLabel shrink htmlFor="dateInput" >Support Date</InputLabel>
                        <Typography id="dateInput" className={`p-3 pb-0`}>{format(parseISO(note.date), 'yyyy-MM-dd')}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid sm={6} xs={12} className="flex justify-center">
                      <FormControl size="small" fullWidth margin="dense">
                        <InputLabel shrink htmlFor="timeInput">Support Duration</InputLabel>
                        <Typography id="timeInput" className={`p-3 pb-0`}>{note.hours}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid sm={6} xs={12} className="flex justify-center">
                      <FormControl size="small" fullWidth margin="dense">
                        <InputLabel shrink htmlFor="distanceInput">Distance Traveled</InputLabel>
                        <Typography id="distanceInput" className={`p-3 pb-0`}>{`${note.kilos}`}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid sm={6} xs={12} className="flex justify-center">
                      <FormControl size="small" fullWidth margin="dense">
                        <InputLabel shrink htmlFor="CarerInput">Carer</InputLabel>
                        <Typography id="carerInput" className={`p-3 pb-0`}>{`${user.firstName} ${user?.lastName}`}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid xs={12} className="flex justify-center">
                      <FormControl size="small" fullWidth margin="dense">
                        <InputLabel shrink htmlFor="notes">Notes</InputLabel>
                        <Typography id="notes" className={`p-3 pb-0`}>{note.notes}</Typography>
                      </FormControl>
                    </Grid>
                  </Grid>
                );
                return (<Box key={index} className={`hidden`} />);
              })}
            </Stack>
          </Collapse> */}
        </Grid>
      </DialogContent>
      {/* <DialogActions sx={{ justifyContent: 'end', alignContent: 'space-between', alignItems: 'center', px: '20px' }}>
        <Box>
          <Button onClick={() => handleExit()}>Close</Button>
        </Box>
      </DialogActions> */}
    </Box>
  );
};

export default memo(ViewClient);