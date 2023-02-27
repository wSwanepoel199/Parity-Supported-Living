import { Box, Button, Checkbox, Chip, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Input, InputAdornment, InputLabel, ListSubheader, MenuItem, OutlinedInput, Select, Switch, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Unstable_Grid2/";
import { format, formatISO, parseISO } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useGetAllClientsQuery } from "../../shared/redux/client/clientApiSlice";
import { useAddPostMutation } from "../../shared/redux/posts/postApiSlice";

const CreatePost = ({ setOpenDialog }) => {
  const userState = useSelector(state => state.user);
  const { data } = useGetAllClientsQuery();
  const [addPost, { isLoading }] = useAddPostMutation();
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
    if (data) setOptions(data.data.data);
    if (isLoading) setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });

  }, [isLoading, setOpenDialog, data]);

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
            {options ?
              <FormControl variant="standard" size="small" fullWidth margin="dense">
                <InputLabel htmlFor="clientInput">Client</InputLabel>
                <Select
                  id="clientInput"
                  name='clientId'
                  required
                  value={formData.clientId}
                  onChange={(e) => handleInput(e.target)}
                >
                  {options?.map((client, index) => {
                    return (
                      <MenuItem key={index} value={client.clientId}>{client.firstName} {client?.lastName}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl> : null}
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
          <Button color="success" variant="contained" type="submit">Create</Button>
          <Button onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; })}>Cancel</Button>
        </Box>
      </DialogActions>
    </Box>
  );
};

export default CreatePost;