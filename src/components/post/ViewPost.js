import { Box, Button, DialogActions, DialogContent, FormControl, FormControlLabel, InputLabel, Switch, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import { format, parseISO } from "date-fns";
import { useSelector } from "react-redux";

const ViewPost = ({ setOpenDialog, post }) => {
  const userState = useSelector(state => state.user);
  const formData = JSON.parse(JSON.stringify(post).replace(/:null/gi, ":\"\""));


  return (
    <Box>
      <DialogContent>
        <Grid container spacing={2} className="flex justify-center">
          <Grid xs={12} className=" border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent">
            <Typography>Details</Typography>
          </Grid>
          <Grid xs={6} className="flex justify-center">
            <FormControl size="small" fullWidth margin="dense">
              <InputLabel shrink htmlFor="dateInput" >Support Date</InputLabel>
              <Typography id="dateInput" className={`p-3`}>{format(parseISO(formData.date), 'yyyy-MM-dd')}</Typography>
            </FormControl>
          </Grid>
          <Grid xs={6} className="flex justify-center">
            <FormControl size="small" fullWidth margin="dense">
              <InputLabel shrink htmlFor="timeInput">Support Duration</InputLabel>
              <Typography id="timeInput" className={`p-3`}>{formData.hours !== '' ? `${formData.hours}` : 0}</Typography>
            </FormControl>
          </Grid>
          <Grid xs={6} className="flex justify-center">
            <FormControl size="small" fullWidth margin="dense">
              <InputLabel shrink htmlFor="clientInput">Client's Name</InputLabel>
              <Typography className={`p-3`}>{formData.client}</Typography>
            </FormControl>
          </Grid>
          <Grid xs={6} className="flex justify-center">
            <FormControl size="small" fullWidth margin="dense">
              <InputLabel shrink htmlFor="distanceInput">Distance Traveled</InputLabel>
              <Typography id="distanceInput" className={`p-3`}>{formData.kilos !== '' ? `${formData.kilos}` : 0}</Typography>
            </FormControl>
          </Grid>
          <Grid xs={6} className="flex justify-center">
            <FormControl size="small" fullWidth margin="dense">
              <InputLabel shrink htmlFor="CarerInput">Carer</InputLabel>
              <Typography id="carerInput" className={`p-3`}>{formData.carer.firstName} {formData.carer?.lastName}</Typography>
            </FormControl>
          </Grid>
          <Grid xs={12} className=" border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent">
            <Typography>Notes</Typography>
          </Grid>
          <Grid xs={12} className="flex justify-center">
            <FormControl size="small" fullWidth margin="dense">
              <Typography id="notesInput" className={`p-3`}>{formData.notes}</Typography>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: ["Admin", "Coordinator"].includes(userState.user.role) ? 'space-between' : 'end', alignContent: 'space-between' }}>
        {["Admin", "Coordinator"].includes(userState.user.role) ?
          <FormControlLabel
            control={
              <Switch
                checked={formData.private}
              />}
            label="Confidential"
          /> : null}
        <Box>
          <Button onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; })}>Close</Button>
        </Box>
      </DialogActions>
    </Box>
  );
};

export default ViewPost;