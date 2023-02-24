import { Box, Button, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Input, InputLabel, MenuItem, OutlinedInput, Select, Switch, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import { format, formatISO, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useUpdatePostMutation } from "../../shared/redux/posts/postApiSlice";
import { useGetAllUsersQuery } from "../../shared/redux/admin/adminApiSlice";

const UpdatePost = ({ setOpenDialog, post }) => {
  const adminState = useSelector(state => state.admin);
  useGetAllUsersQuery();
  const mounted = useRef();
  const [updatePost, { isLoading: updatePostLoading }] = useUpdatePostMutation();
  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(post).replace(/:null/gi, ":\"\"")));
  const [options, setOptions] = useState([post.carer]);

  useEffect(() => {
    if (!mounted.current) {
      if (adminState.users) {
        setOptions(adminState.users);
      }
      mounted.current = true;
    };
    if (updatePostLoading) setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
    return () => {
      mounted.current = false;
    };
  }, [mounted, post, setOpenDialog, updatePostLoading, adminState.users]);

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
    const parsedForm = formData;
    Object.keys(parsedForm).forEach(key => {
      if (parsedForm[key] === '') {
        parsedForm[key] = null;
      }
    });
    updatePost(parsedForm);
  };


  return (
    <Box component='form' onSubmit={(e) => handleSubmit(e)}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <DialogTitle>
          Edit Note
        </DialogTitle>
      </Box>
      {mounted.current ?
        <DialogContent>
          <Grid container spacing={2} className="flex justify-center">
            <Grid xs={12} className=" border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent">
              <Typography>Details</Typography>
            </Grid>
            <Grid sm={6} xs={12} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel shrink htmlFor="dateInput" >Support Date</InputLabel>
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
            <Grid sm={6} xs={12} className="flex justify-center">
              {options ?
                <FormControl variant="standard" size="small" fullWidth margin="dense">
                  <InputLabel htmlFor="CarerInput">Carer</InputLabel>
                  <Select
                    id="carerInput"
                    name='carerId'
                    required
                    value={formData.carerId}
                    onChange={(e) => handleInput(e.target)}
                  >
                    {options?.map((user, index) => {
                      return (
                        <MenuItem key={index} value={user.userId}>{user.firstName} {user?.lastName}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl> : null}
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
        : null}
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
        <Box >
          <Button color="success" variant="contained" type="submit">Update</Button>
          <Button onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; })}>Cancel</Button>
        </Box>
      </DialogActions>
    </Box>
  );
};

export default UpdatePost;