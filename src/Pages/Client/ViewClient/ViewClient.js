import { Box, Button, Collapse, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, Stack, Typography } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CloseIcon from '@mui/icons-material/Close';
import Grid from "@mui/material/Unstable_Grid2/";
// import { format, parseISO } from "date-fns";
import { memo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
// import { useSelector } from "react-redux";

const ViewClient = () => {
  // const userState = useSelector(state => state.user);
  // const adminState = useSelector(state => state.admin);
  const [openDialog, setOpenDialog] = useOutletContext();
  const client = openDialog.data;
  const navigate = useNavigate();
  const formData = JSON.parse(JSON.stringify(client).replace(/:null/gi, ":\"\""));
  // const users = [...client.carers, ...(adminState.users ? adminState.users : [])];
  const [open, setOpen] = useState({
    clientDetails: true,
    carersDetails: false,
    notesDetails: false
  });

  const handleExit = () => {
    setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
    navigate('..');
  };


  return (
    <Box>
      <DialogTitle className={`flex justify-between items-center`}>
        <Typography variant="h6" component="p">
          Viewing Client {client.firstName} {client?.lastName}
        </Typography>
        <IconButton onClick={() => handleExit()}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} className="flex justify-center">
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
            <Typography>{formData.name}'s Details</Typography>
            <ArrowBackIosNewIcon className={`transition group-[.clientDetails]:rotate-[-90deg] duration-100 ease-linear`} />

          </Grid>
          <Collapse
            in={open.clientDetails}
            className={`
              w-[90%]
              `}
          >
            <Stack className={` border-[1px] border-slate-300 border-solid mt-[11px]`}>
              <Grid container spacing={1} className="flex justify-center">
                <Grid sm={6} xs={12} className="flex justify-center">
                  <FormControl size="small" fullWidth margin="dense">
                    <InputLabel shrink htmlFor="clientName" >Name</InputLabel>
                    <Typography id="clientName" className={`p-3`}>{formData.name}</Typography>
                  </FormControl>
                </Grid>
                <Grid sm={6} xs={12} className="flex justify-center">
                  <FormControl size="small" fullWidth margin="dense">
                    <InputLabel shrink htmlFor="clientPhoneNumber">Phone Number</InputLabel>
                    <Typography id="clientPhoneNumber" className={`p-3`}>{formData.phoneNumber}</Typography>
                  </FormControl>
                </Grid>
                <Grid sm={6} xs={12} className="flex justify-center">
                  <FormControl size="small" fullWidth margin="dense">
                    <InputLabel shrink htmlFor="clientEmail">Email</InputLabel>
                    <Typography id="clientEmail" className={`p-3`}>{formData.email}</Typography>
                  </FormControl>
                </Grid>
                <Grid sm={6} xs={12} className="flex justify-center ">
                  <FormControl size="small" fullWidth margin="dense">
                    <InputLabel shrink htmlFor="clientsAddress">Address</InputLabel>
                    <Typography id="clientsAddress" className={`p-3`}>{formData.address}</Typography>
                  </FormControl>
                </Grid>
                <Grid xs={12} className="flex justify-center">
                  <FormControl size="small" fullWidth margin="dense">
                    <InputLabel shrink htmlFor="notes">Details</InputLabel>
                    <Typography id="notes" className={`p-3 pb-0`}>{formData.notes}</Typography>
                  </FormControl>
                </Grid>
              </Grid>
            </Stack>
          </Collapse>
          <Grid xs={12}
            className={`border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent 
            flex justify-between
            group ${open.carersDetails && 'carersDetails'}`}
            onClick={() => setOpen(prev => {
              return {
                ...prev,
                carersDetails: !prev.carersDetails
              };
            })}
          >
            <Typography>Carers Details</Typography>
            {formData.carers ?
              <ArrowBackIosNewIcon className={`transition group-[.carersDetails]:rotate-[-90deg] duration-100 ease-linear`} />
              : null}
          </Grid>
          {formData.carers ?
            <Collapse
              in={open.carersDetails}
              className={`w-[90%]`}
            >
              <Stack className={`divide-y divide-x-0 divide-slate-300 divide-solid border-[1px] border-slate-300 border-solid mt-[11px]`}>
                {formData.carers.map((carer, index) => {
                  return (
                    <Grid container spacing={0.5} key={index} className={`flex justify-between flex-wrap `}>
                      <Grid sm={6} xs={12}>
                        <FormControl size="small" margin="dense" className={`min-w-[200px]`}>
                          <InputLabel shrink htmlFor="carerName">Carer</InputLabel>
                          <Typography id="carerName" className={`p-3 pb-0`}>{`${carer.firstName} ${carer?.lastName}`}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid sm={6} xs={12}>
                        <FormControl size="small" margin="dense" className={`min-w-[200px]`}>
                          <InputLabel shrink htmlFor="carerEmail">Carer's Email</InputLabel>
                          <Typography id="carerEmail" className={`p-3 pb-0`}>{`${carer.email}`}</Typography>
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
      <DialogActions sx={{ justifyContent: 'end', alignContent: 'space-between', alignItems: 'center', px: '20px' }}>
        <Box>
          <Button onClick={() => handleExit()}>Close</Button>
        </Box>
      </DialogActions>
    </Box>
  );
};

export default memo(ViewClient);