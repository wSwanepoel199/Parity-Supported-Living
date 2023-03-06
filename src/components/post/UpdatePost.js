import { Box, Button, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, Input, InputLabel, MenuItem, OutlinedInput, Select, Switch, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import { format, formatISO, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useUpdatePostMutation } from "../../shared/redux/posts/postApiSlice";

const UpdatePost = ({ setOpenDialog, data: post }) => {
  const clientState = useSelector(state => state.clients);
  const adminState = useSelector(state => state.admin);
  const mounted = useRef();
  const [updatePost, { isLoading: updatePostLoading }] = useUpdatePostMutation();
  const [formData, setFormData] = useState({
    date: formatISO(new Date()),
    hours: 0,
    kilos: 0,
    notes: "",
    private: false,
    clientId: '',
    clientName: '',
    carerId: post.carerId,
    carerName: ''
  });

  const [carerOptions, setCarerOptions] = useState([(post.carer || "")]);
  const [clientOptions, setClientOptions] = useState([(post.client || "")]);

  // useMemo(() => {
  //   if (adminState.users && carerOptions.length === 1) setCarerOptions(() => adminState.users);
  // }, [adminState.users, carerOptions]);

  // useMemo(() => {
  //   if (clientState.clients && clientOptions.length < 2) setClientOptions(() => clientState.clients);
  // }, [clientState.clients, clientOptions]);


  useEffect(() => {
    const parsedPost = JSON.stringify(post).replace(/:null/gi, ":\"\"");
    if (!mounted.current) {
      setFormData(prev => {
        if (JSON.stringify(prev) !== parsedPost) {
          return JSON.parse(parsedPost);
        } else {
          return prev;
        }
      });
      if (adminState.users && carerOptions.length === 1) setCarerOptions(adminState.users);
      if (clientState.clients.length > 0 && clientOptions.length === 1) setClientOptions(clientState.clients);

      mounted.current = true;
    };
    if (updatePostLoading) setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
    return () => {
      if (!mounted.current) return;
      if (mounted.current) mounted.current = false;
    };
  }, [mounted, post, setOpenDialog, updatePostLoading, clientState.clients, clientOptions, adminState.users, carerOptions]);

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
        console.log(value);
        setFormData(prev => {
          return {
            ...prev,
            [name]: value,
            clientName: clientState.clients.find(client => client.clientId === value).name
          };
        });
        return;
      }
      case 'carerId': {
        setFormData(prev => {
          return {
            ...prev,
            [name]: value,
            carerName: adminState.users.find(carer => carer.userId === value).name
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
      {console.log(formData)}
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
            {(formData.client === "" && formData.clientId === "") ?
              <Grid sm={6} xs={12} className="flex justify-center">
                <FormControl size="small" fullWidth margin="dense">
                  <InputLabel htmlFor="clientInput">Client's Name</InputLabel>
                  <Input
                    id="clientInput"
                    name="client"
                    type="text"
                    disabled
                    value={formData.clientName}
                    onChange={(e) => handleInput(e.target)}
                  />
                  <FormHelperText>Client Details lost, please select new Client from dropdown</FormHelperText>
                </FormControl>
              </Grid> : null}
            <Grid sm={6} xs={12} className="flex justify-center">
              {clientOptions ?
                <FormControl variant="standard" size="small" fullWidth margin="dense">
                  <InputLabel htmlFor="clientInput">Client's Name</InputLabel>
                  <Select
                    id="clientInput"
                    name='clientId'
                    required
                    value={formData.clientId}
                    onChange={(e) => handleInput(e.target)}
                  >
                    {clientOptions.map((client, index) => {
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
            {(formData.carer === "" && formData.carerId === "") ?
              <Grid sm={6} xs={12} className="flex justify-center">
                <FormControl size="small" fullWidth margin="dense">
                  <InputLabel htmlFor="carerInput">Carer</InputLabel>
                  <Input
                    id="carerInput"
                    name="carer"
                    type="text"
                    disabled
                    value={formData.carerName}
                    onChange={(e) => handleInput(e.target)}
                  />
                  <FormHelperText>Carer details lost, please select Carer from dropdown</FormHelperText>
                </FormControl>
              </Grid> : null}
            <Grid sm={6} xs={12} className="flex justify-center">
              {carerOptions ?
                <FormControl variant="standard" size="small" fullWidth margin="dense">
                  <InputLabel htmlFor="CarerInput">Carer</InputLabel>
                  <Select
                    id="carerInput"
                    name='carerId'
                    required
                    value={formData.carerId}
                    onChange={(e) => handleInput(e.target)}
                  >
                    {carerOptions.map((user, index) => {
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
          <Button color="success" variant="contained" type="submit" disabled={formData.clientId === "" || formData.carerId === ""}>Update</Button>
          <Button onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; })}>Cancel</Button>
        </Box>
      </DialogActions>
    </Box>
  );
};

export default UpdatePost;