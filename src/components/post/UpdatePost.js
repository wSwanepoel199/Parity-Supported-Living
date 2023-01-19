import { Box, Button, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, IconButton, Input, InputLabel, MenuItem, OutlinedInput, Select, Switch } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from "@mui/material/Unstable_Grid2/";
import { format, formatISO, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useUpdatePostMutation } from "../../shared/redux/posts/postSlice";
import { useDeleteTargetPostMutation, useGetAllUsersQuery } from "../../shared/redux/admin/adminSlice";

const UpdatePost = ({ setOpenDialog, post }) => {
  const userState = useSelector(state => state.user);
  const adminState = useSelector(state => state.admin);
  useGetAllUsersQuery();
  const mounted = useRef();
  const [updatePost, { isLoading: updatePostLoading }] = useUpdatePostMutation();
  const [deleteTargetPost, { isLoading: deleteLoading }] = useDeleteTargetPostMutation();
  const [editForm, setEditForm] = useState(false);
  const [formData, setFormData] = useState(post);
  const [options, setOptions] = useState([post.carer]);

  useEffect(() => {
    if (!mounted.current) {
      const parsedPost = JSON.parse(JSON.stringify(post).replace(/:null/gi, ":\"\""));
      setFormData(prev => {
        return {
          ...prev,
          ...parsedPost
        };
      });
      setOptions(prev => {
        if (adminState.users) {
          return adminState.users;
        }
      });
      mounted.current = true;
    }
    if (deleteLoading || updatePostLoading) setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
    return () => {
      mounted.current = false;
    };
  }, [mounted, post, setOpenDialog, deleteLoading, updatePostLoading, adminState]);

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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <DialogTitle>
          Edit Note
        </DialogTitle>
        {["Admin", "Coordinator"].includes(userState.user.role) ? <FormControlLabel control={<Switch checked={editForm} onChange={() => setEditForm(prev => !prev)} />} label="Toggle Edit" /> : null}
      </Box>
      {mounted.current ?
        <DialogContent>
          <Grid container spacing={2} className="flex justify-center">
            <Grid xs={6} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel shrink htmlFor="dateInput" >Support Date</InputLabel>
                <Input
                  id="dateInput"
                  name="date"
                  type="date"
                  disableUnderline={!editForm}
                  readOnly={!editForm}
                  value={format(parseISO(formData.date), 'yyyy-MM-dd')}
                  onChange={(e) => handleInput(e.target)}
                />
              </FormControl>
            </Grid>
            <Grid xs={6} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel htmlFor="timeInput">Support Duration</InputLabel>
                <Input
                  id="timeInput"
                  name="hours"
                  type="number"
                  disableUnderline={!editForm}
                  readOnly={!editForm}
                  value={formData.hours}
                  onChange={(e) => handleInput(e.target)}
                />
              </FormControl>
            </Grid>
            <Grid xs={6} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel htmlFor="clientInput">Client's Name</InputLabel>
                <Input
                  id="clientInput"
                  name="client"
                  type="text"
                  disableUnderline={!editForm}
                  readOnly={!editForm}
                  value={formData.client}
                  onChange={(e) => handleInput(e.target)}
                />
              </FormControl>
            </Grid>
            <Grid xs={6} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel htmlFor="distanceInput">Distance Traveled</InputLabel>
                <Input
                  id="distanceInput"
                  name="kilos"
                  type="number"
                  disableUnderline={!editForm}
                  readOnly={!editForm}
                  value={formData.kilos}
                  onChange={(e) => handleInput(e.target)}
                />
              </FormControl>
            </Grid>
            <Grid xs={6} className="flex justify-center">
              {options ?
                <FormControl variant="standard" size="small" fullWidth margin="dense">
                  <InputLabel htmlFor="CarerInput">Carer</InputLabel>
                  <Select
                    id="carerInput"
                    name='carerId'
                    required
                    disableUnderline={!editForm}
                    readOnly={!editForm}
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
            <Grid xs={12} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel htmlFor="notesInput">Notes</InputLabel>
                <OutlinedInput
                  id="notesInput"
                  name="notes"
                  type="text"
                  label="Notes"
                  readOnly={!editForm}
                  multiline
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => handleInput(e.target)}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        : null}
      <DialogActions sx={{ justifyContent: (editForm) ? 'space-between' : 'end', alignContent: 'space-between' }}>
        {(editForm) ?
          <IconButton size="large" onClick={() => deleteTargetPost(post)}>
            <DeleteIcon fontSize="inherit" />
          </IconButton> : null}
        <Box >
          {editForm ? <Button onClick={(e) => handleSubmit(e)}>Edit</Button> : null}
          <Button onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; })}>Cancel</Button>
        </Box>
      </DialogActions>
    </Box>
  );
};

export default UpdatePost;