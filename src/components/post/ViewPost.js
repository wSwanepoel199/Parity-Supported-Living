import { Box, Button, DialogActions, DialogContent, FormControl, FormControlLabel, InputLabel, Switch, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import { format, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const ViewPost = ({ setOpenDialog, post }) => {
  const adminState = useSelector(state => state.admin);
  const userState = useSelector(state => state.user);
  const mounted = useRef();
  const [formData, setFormData] = useState(post);

  useEffect(() => {
    if (!mounted.current) {
      const parsedPost = JSON.parse(JSON.stringify(post).replace(/:null/gi, ":\"\""));
      setFormData(prev => {
        return {
          ...prev,
          ...parsedPost
        };
      });
      mounted.current = true;
    }

    return () => {
      mounted.current = false;
    };
  }, [mounted, post, setOpenDialog, adminState]);


  return (
    <Box>
      {mounted.current ?
        <DialogContent>
          <Grid container spacing={2} className="flex justify-center">
            <Grid xs={6} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel shrink htmlFor="dateInput" >Support Date</InputLabel>
                {/* <Input
                  id="dateInput"
                  name="date"
                  type="date"
                  // disableUnderline={!editForm}
                  // readOnly={!editForm}
                  value={format(parseISO(formData.date), 'yyyy-MM-dd')}
                  onChange={(e) => handleInput(e.target)}
                /> */}
                <Typography id="dateInput" className={`p-3`}>{format(parseISO(formData.date), 'yyyy-MM-dd')}</Typography>
              </FormControl>
            </Grid>
            <Grid xs={6} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel shrink htmlFor="timeInput">Support Duration</InputLabel>
                {/* <Input
                  id="timeInput"
                  name="hours"
                  type="number"
                  // disableUnderline={!editForm}
                  // readOnly={!editForm}
                  value={formData.hours}
                  onChange={(e) => handleInput(e.target)}
                /> */}
                <Typography id="timeInput" className={`p-3`}>{formData.hours !== '' ? `${formData.hours}` : 0}</Typography>
              </FormControl>
            </Grid>
            <Grid xs={6} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel shrink htmlFor="clientInput">Client's Name</InputLabel>
                {/* <Input
                  id="clientInput"
                  name="client"
                  type="text"
                  // disableUnderline={!editForm}
                  // readOnly={!editForm}
                  value={formData.client}
                  onChange={(e) => handleInput(e.target)}
                /> */}
                <Typography className={`p-3`}>{formData.client}</Typography>
              </FormControl>
            </Grid>
            <Grid xs={6} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel shrink htmlFor="distanceInput">Distance Traveled</InputLabel>
                {/* <Input
                  id="distanceInput"
                  name="kilos"
                  type="number"
                  // disableUnderline={!editForm}
                  // readOnly={!editForm}
                  value={formData.kilos}
                  onChange={(e) => handleInput(e.target)}
                /> */}
                <Typography id="distanceInput" className={`p-3`}>{formData.kilos !== '' ? `${formData.kilos}` : 0}</Typography>
              </FormControl>
            </Grid>
            <Grid xs={6} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel shrink htmlFor="CarerInput">Carer</InputLabel>
                {/* <Select
                    id="carerInput"
                    name='carerId'
                    required
                    // disableUnderline={!editForm}
                    // readOnly={!editForm}
                    value={formData.carerId}
                    onChange={(e) => handleInput(e.target)}
                  >
                    {options?.map((user, index) => {
                      return (
                        <MenuItem key={index} value={user.userId}>{user.firstName} {user?.lastName}</MenuItem>
                      );
                    })}
                  </Select> */}
                <Typography id="carerInput" className={`p-3`}>{formData.carer.firstName} {formData.carer?.lastName}</Typography>
              </FormControl>
            </Grid>
            <Grid xs={12} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel shrink htmlFor="notesInput">Notes</InputLabel>
                {/* <OutlinedInput
                  id="notesInput"
                  name="notes"
                  type="text"
                  label="Notes"
                  // readOnly={!editForm}
                  multiline
                  minRows={4}
                  value={formData.notes}
                  onChange={(e) => handleInput(e.target)}
                /> */}
                <Typography id="notesInput" className={`p-3`}>{formData.notes}</Typography>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        : null}
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
          <Button onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; })}>Cancel</Button>
        </Box>
      </DialogActions>
    </Box>
  );
};

export default ViewPost;