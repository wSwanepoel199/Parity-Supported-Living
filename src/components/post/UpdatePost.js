import { Box, Button, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, IconButton, Input, InputLabel, OutlinedInput, Switch } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from "@mui/material/Unstable_Grid2/";
import { format, formatISO, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useUpdatePostMutation } from "../../shared/redux/posts/postSlice";
import { useDeleteTargetPostMutation } from "../../shared/redux/admin/adminSlice";

const UpdatePost = ({ setOpenDialog, post }) => {
  const userState = useSelector(state => state.user);
  const mounted = useRef();
  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const [deleteTargetPost, { isLoading: deleteLoading }] = useDeleteTargetPostMutation();
  const [editForm, setEditForm] = useState(false);
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
    if (isLoading || deleteLoading) setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
    return () => {
      mounted.current = false;
    };
  }, [mounted, post, isLoading, setOpenDialog, deleteLoading]);

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
    updatePost(formData);
  };


  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <DialogTitle>
          Edit Note
        </DialogTitle>
        {userState.user.role === "Admin" ? <FormControlLabel control={<Switch checked={editForm} onChange={() => setEditForm(prev => !prev)} />} label="Toggle Edit" /> : null}
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
                  readOnly={editForm}
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
                  readOnly={editForm}
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
                  readOnly={editForm}
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
                  readOnly={editForm}
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
                  readOnly={editForm}
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
      <DialogActions sx={{ justifyContent: userState.user.role === "Admin" ? 'space-between' : 'end', alignContent: 'space-between' }}>
        {userState.user.role === "Admin" ?
          <IconButton size="large" onClick={() => deleteTargetPost(post)}>
            <DeleteIcon fontSize="inherit" />
          </IconButton> : null}
        <Box >
          {(editForm && userState.user.role === "Admin") ? <Button onClick={(e) => handleSubmit(e)}>Edit</Button> : null}
          <Button onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; })}>Cancel</Button>
        </Box>
      </DialogActions>
    </Box>
  );
};

export default UpdatePost;