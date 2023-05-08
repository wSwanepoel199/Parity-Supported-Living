import { Box, Button, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, IconButton, Input, InputLabel, MenuItem, OutlinedInput, Select, Switch, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import CloseIcon from '@mui/icons-material/Close';
import { format, formatISO, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAddPostMutation } from "../../../Redux/posts/postApiSlice";

const CreatePost = ({ setOpenDialog, mobile }) => {
  const userState = useSelector(state => state.user);
  const clientState = useSelector(state => state.clients);
  const [addPost] = useAddPostMutation();
  const [formData, setFormData] = useState({
    date: formatISO(new Date()),
    hours: 0,
    kilos: 0,
    clientId: "",
    notes: "",
    carerId: userState.user.userId,
    private: false,
  });
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (clientState.clients.length > 0) setOptions(clientState.clients);
    // if (isLoading) setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });

  }, [clientState.clients]);

  const handleInput = ({ value, name }) => {
    switch (name) {
      case "date": {
        setFormData(prev => {
          return {
            ...prev,
            [name]: formatISO(new Date(value))
          };
        });
        return;
      }
      case "kilos":
      case "hours": {
        setFormData(prev => {
          return {
            ...prev,
            [name]: parseInt(value)
          };
        });
        return;
      }
      case 'clientId': {
        setFormData(prev => {
          return {
            ...prev,
            [name]: value,
          };
        });
        return;
      }
      default: {
        setFormData(prev => {
          return {
            ...prev,
            [name]: value
          };
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPost(formData);
    setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
  };


  return (
    <Box component='form' onSubmit={(e) => handleSubmit(e)}>
      {/* {console.log(formData)} */}
      <DialogTitle className={`flex justify-between items-center`}>
        <Typography variant="h6" component="p">
          New Note
        </Typography>
        <IconButton onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; })}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} className="flex justify-center">
          <Grid xs={12} className=" border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent">
            <Typography>Details</Typography>
          </Grid>
          <Grid sm={6} xs={12} className="flex justify-center">
            <FormControl size="small" fullWidth margin="dense">
              <InputLabel shrink htmlFor="dateInput">Support Date</InputLabel>
              <Input
                id="dateInput"
                name="date"
                type="date"
                required
                value={format(parseISO(formData.date), 'yyyy-MM-dd')}
                onChange={(e) => handleInput(e.target)}
              />
            </FormControl>
          </Grid>
          <Grid sm={6} xs={12} className="flex justify-center">
            <FormControl size="small" fullWidth margin="dense">
              <InputLabel htmlFor="timeInput">Support Duration</InputLabel>
              <Input
                id="timeInput"
                name="hours"
                type="number"
                required
                value={formData.hours}
                onChange={(e) => handleInput(e.target)}
              />
            </FormControl>
          </Grid>
          <Grid sm={6} xs={12} className="flex justify-center">
            <FormControl variant="standard" size="small" fullWidth margin="dense">
              <InputLabel htmlFor="clientInput">Client</InputLabel>
              <Select
                id="clientInput"
                name='clientId'
                required
                value={formData.clientId}
                onChange={(e) => handleInput(e.target)}
              >
                {options.map((client) => {
                  return (
                    <MenuItem key={client.id} value={client?.clientId}>{client?.firstName} {client?.lastName}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid sm={6} xs={12} className="flex justify-center">
            <FormControl size="small" fullWidth margin="dense">
              <InputLabel htmlFor="distanceInput">Distance Traveled</InputLabel>
              <Input
                id="distanceInput"
                name="kilos"
                type="number"
                required
                value={formData.kilos}
                onChange={(e) => handleInput(e.target)}
              />
            </FormControl>
          </Grid>
          <Grid xs={12} className=" border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent">
            <Typography>Notes</Typography>
          </Grid>
          <Grid xs={12} className="flex justify-center">
            <FormControl size="small" fullWidth margin="dense">
              <OutlinedInput
                id="notesInput"
                name="notes"
                type="text"
                multiline
                minRows={4}
                value={formData.notes}
                onChange={(e) => handleInput(e.target)}
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', alignContent: 'space-between' }}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.private}
              onChange={() => setFormData(prev => {
                return {
                  ...prev,
                  private: !prev.private
                };
              }
              )}

            />}
          label="Confidential"

        />
        <Box>
          {!mobile &&
            <Button
              onClick={() =>
                setOpenDialog(prev => {
                  return { ...prev, open: !prev.open, type: '' };
                })}>Cancel</Button>}
          <Button color="success" variant="contained" type="submit">Create</Button>
        </Box>
      </DialogActions>
    </Box>
  );
};

export default CreatePost;