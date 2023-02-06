import { Box, Button, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Input, InputLabel, OutlinedInput, Switch } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import { format, formatISO, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAddPostMutation } from "../../shared/redux/posts/postApiSlice";

const CreatePost = ({ setOpenDialog }) => {
  const userState = useSelector(state => state.user);
  const [addPost, { isLoading }] = useAddPostMutation();
  const [formData, setFormData] = useState({
    date: formatISO(new Date()),
    hours: 0,
    kilos: 0,
    client: "",
    notes: "",
    carerId: userState.user.userId,
    private: false,
  });

  useEffect(() => {
    if (isLoading) setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });

  }, [isLoading, setOpenDialog]);

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
  };


  return (
    <Box component='form' onSubmit={(e) => handleSubmit(e)}>
      <DialogTitle>
        New Note
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} className="flex justify-center">
          <Grid sm={6} xs={12} className="flex justify-center">
            <FormControl size="small" fullWidth margin="dense">
              <InputLabel shrink htmlFor="dateInput">Support Date</InputLabel>
              <Input
                id="dateInput"
                name="date"
                type="date"
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
                value={formData.hours}
                onChange={(e) => handleInput(e.target)}
              />
            </FormControl>
          </Grid>
          <Grid sm={6} xs={12} className="flex justify-center">
            <FormControl size="small" fullWidth margin="dense">
              <InputLabel htmlFor="clientInput">Client's Name</InputLabel>
              <Input
                id="clientInput"
                name="client"
                type="text"
                value={formData.client}
                onChange={(e) => handleInput(e.target)}
              />
            </FormControl>
          </Grid>
          <Grid sm={6} xs={12} className="flex justify-center">
            <FormControl size="small" fullWidth margin="dense">
              <InputLabel htmlFor="distanceInput">Distance Traveled</InputLabel>
              <Input
                id="distanceInput"
                name="kilos"
                type="number"
                value={formData.kilos}
                onChange={(e) => handleInput(e.target)}
              />
            </FormControl>
          </Grid>
          <Grid xs={12} className="flex justify-center">
            <FormControl size="small" fullWidth margin="dense">
              <InputLabel htmlFor="notesInput">Notes</InputLabel>
              <OutlinedInput
                id="notesInput"
                name="notes"
                type="text"
                label="Notes"
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
          <Button type="submit">Create</Button>
          <Button onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; })}>Cancel</Button>
        </Box>
      </DialogActions>
    </Box>
  );
};

export default CreatePost;