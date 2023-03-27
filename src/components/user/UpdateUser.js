import { Box, Button, Checkbox, Chip, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, IconButton, Input, InputAdornment, InputLabel, ListSubheader, MenuItem, OutlinedInput, Select, Switch, Typography, } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from '@mui/icons-material/Close';
import Grid from "@mui/material/Unstable_Grid2/";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useUpdateUserMutation } from "../../shared/redux/user/userApiSlice";
import { useSelector } from "react-redux";

const containsText = (user, searchText) =>
  user.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

const UpdateUser = ({ setOpenDialog, data: user }) => {
  const clientState = useSelector(state => state.clients);
  const [updateUser] = useUpdateUserMutation();
  const mounted = useRef();
  const [formData, setFormData] = useState({
    showPassword: false,
    resetPassword: true,
    email: '',
    lastName: '',
    firstName: '',
    role: '',
    clients: [],
  });


  const [searchText, setSearchText] = useState("");

  const [options, setOptions] = useState([]);

  const displayedOptions = useMemo(
    () => options?.filter((option) => containsText(option.name, searchText)),
    [options, searchText]
  );

  useMemo(() => {
    const { clients, ...selectedUser } = user;
    setFormData(prev => {
      const clientIds = clients.map(client => client.clientId);
      return {
        ...prev,
        ...JSON.parse(JSON.stringify(selectedUser).replace(/:null/gi, ":\"\"")),
        clients: [
          ...clientIds
        ]
      };
    });
    if (clients) setOptions(clients);
  }, [user]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    }
    if (clientState.clients.length > 0) setOptions(clientState.clients);
    return () => {
      mounted.current = false;
    };
  }, [mounted, setOpenDialog, clientState.clients]);

  const handleInput = (e) => {
    const { value, name } = e.target;
    setFormData(prev => {
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    delete formData.showPassword;
    delete formData.name;
    updateUser(formData);
    setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
  };


  return (
    <Box component='form' onSubmit={(e) => handleSubmit(e)}>
      <DialogTitle className={`flex justify-between items-center`}>
        <Typography variant="h6" component="p">
          Edit {user.name}
        </Typography>
        <IconButton onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; })}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {mounted.current ?
        <DialogContent>
          <Grid container spacing={2} className="flex justify-center w-full">
            <Grid xs={12} className=" border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent">
              <Typography>Details</Typography>
            </Grid>
            <Grid sm={6} xs={12} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel shrink htmlFor="firstNameInput">First Name</InputLabel>
                <Input
                  id="firstNameInput"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInput}
                />
              </FormControl>
            </Grid>
            <Grid sm={6} xs={12} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel shrink htmlFor="lastNameInput">Last Name</InputLabel>
                <Input
                  id="lastNameInput"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInput}
                />
              </FormControl>
            </Grid>
            <Grid sm={6} xs={12} className="flex justify-center">
              {["Admin", "Carer", "Coordinator"].includes(formData.role) ?
                <FormControl variant="standard" size="small" fullWidth margin="dense">
                  <InputLabel shrink htmlFor="roleInput" className={`px-5`}>Role</InputLabel>
                  <Select
                    id="roleInput"
                    name='role'
                    required
                    value={formData.role}
                    onChange={handleInput}
                  >
                    <MenuItem value={"Admin"}>Admin</MenuItem>
                    <MenuItem value={"Carer"}>Carer</MenuItem>
                    <MenuItem value={"Coordinator"}>Coordinator</MenuItem>
                  </Select>
                </FormControl> : null}
            </Grid>
            <Grid sm={6} xs={12} className="flex justify-center">
              <FormControl size="small" fullWidth margin="dense">
                <InputLabel shrink htmlFor="emailInput">Email</InputLabel>
                <Input
                  id="emailInput"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInput}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} className=" border-b-2 border-b-gray-400 border-solid border-x-transparent border-t-transparent">
              <Typography>Clients</Typography>
            </Grid>
            <Grid xs={12} className="flex justify-center">
              {options ?
                <FormControl variant="standard" size="small" fullWidth margin="dense">
                  <Select
                    id="clientsInput"
                    name='clients'
                    multiple
                    required
                    input={<OutlinedInput id="clientsListInput" />}
                    renderValue={(selected) => (
                      <Box
                        className={`flex flex-wrap gap-2`}
                      >
                        {selected.map((value, index) => {
                          return (
                            <Box key={index}>
                              <Chip label={options.find((user) => value === user.clientId).name} />
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                    MenuProps={{ autoFocus: false }}
                    value={formData.clients}
                    onChange={(e) => handleInput(e)}
                    onClose={() => setSearchText("")}
                  >
                    <ListSubheader>
                      <Input
                        size="small"
                        autoFocus
                        fullWidth
                        startAdornment={
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        }
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key !== "Escape") {
                            // Prevents autoselecting item while typing (default Select behaviour)
                            e.stopPropagation();
                          }
                        }}
                      />
                    </ListSubheader>
                    {displayedOptions?.map((client, index) => {
                      return (
                        <MenuItem key={index} value={client.clientId}>
                          <Checkbox checked={formData.clients.indexOf(client.clientId) > -1} />
                          {client.firstName} {client?.lastName}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl> : null}
            </Grid>
          </Grid>
        </DialogContent>
        : null}
      <DialogActions sx={{ justifyContent: 'space-between', alignContent: 'space-between' }}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.resetPassword}
              onChange={() => setFormData(prev => {
                return {
                  ...prev,
                  resetPassword: !prev.resetPassword
                };
              }
              )}

            />}
          label="Toggle Password Reset"

        />
        <Box >
          <Button onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; })}>Cancel</Button>
          <Button color="success" variant="contained" type="submit">UPDATE</Button>
        </Box>
      </DialogActions>
    </Box>
  );
};

export default memo(UpdateUser);