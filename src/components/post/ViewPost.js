import { Box, Button, Collapse, DialogActions, DialogContent, FormControl, InputLabel, Typography } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import Grid from "@mui/material/Unstable_Grid2/";
import { format, parseISO } from "date-fns";
import { useState } from "react";

const ViewPost = ({ setOpenDialog, data: post }) => {
  const formData = JSON.parse(JSON.stringify(post).replace(/:null/gi, ":\"\""));
  const [open, setOpen] = useState({
    noteDetails: true,
    clientDetails: false,
    notes: false
  });


  return (
    <Box>
      <DialogContent>
        {console.log(formData)}
        <Grid container spacing={2} className="flex justify-center">
          <Grid xs={12}
            className=" border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent flex justify-between"
            onClick={() => setOpen(prev => {
              return {
                ...prev,
                noteDetails: !prev.noteDetails
              };
            })}
          >
            <Typography>Case Note Details</Typography>
            {open.noteDetails ? <ArrowBackIosNewIcon className={`rotate-[-90deg]`} /> : <ArrowBackIosNewIcon />}
          </Grid>
          <Collapse
            in={open.noteDetails}
            className={`
              w-full
              `}
          >
            <Grid container spacing={2} className="flex justify-center">
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
            className="
          border-b-2
          border-b-gray-400
          border-solid
          border-x-transparent
          border-t-transparent
          flex
          justify-between"
            onClick={() => setOpen(prev => {
              return {
                ...prev,
                clientDetails: !prev.clientDetails
              };
            })}
          >
            <Typography>Client Details</Typography>
            {formData.client ?
              open.clientDetails ? <ArrowBackIosNewIcon className={`rotate-[-90deg]`} /> : <ArrowBackIosNewIcon />
              : null}
          </Grid>
          {formData.client ?
            <Collapse
              in={open.clientDetails}
              className={`
              w-full
              `}
            >
              <Grid container>
                <Grid sm={6} xs={12} className="flex justify-center">
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
            className=" border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent flex justify-between"
            onClick={() => setOpen(prev => {
              return {
                ...prev,
                notes: !prev.notes
              };
            })}
          >
            <Typography>Case Notes</Typography>
            {open.notes ? <ArrowBackIosNewIcon className={`rotate-[-90deg]`} /> : <ArrowBackIosNewIcon />}
          </Grid>
          <Collapse
            in={open.notes}
            className={`
              w-full
              `}
          >
            <Grid container>
              <Grid xs={12} className="flex justify-center">
                <FormControl size="small" fullWidth margin="dense">
                  <Typography id="notesInput" className={`p-3`}>{formData.notes}</Typography>
                </FormControl>
              </Grid>
            </Grid>
          </Collapse>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', alignContent: 'space-between', alignItems: 'center', px: '20px' }}>
        <Box className={`flex justify-center content-center`}>
          <Typography className={`pr-1`}>Confidential: </Typography>
          {post.private ? <DoneIcon /> : <CloseIcon />}
        </Box>
        <Box>
          <Button onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; })}>Close</Button>
        </Box>
      </DialogActions>
    </Box >
  );
};

export default ViewPost;