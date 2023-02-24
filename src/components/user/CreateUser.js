import { Box, Button, Checkbox, Chip, DialogActions, DialogContent, DialogTitle, FormControl, Input, InputAdornment, InputLabel, ListSubheader, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Unstable_Grid2/";
import { useEffect, useMemo, useState } from "react";
import { useGetAllClientsQuery } from "../../shared/redux/client/clientApiSlice";
import { useCreateUserMutation } from "../../shared/redux/user/userApiSlice";

const containsText = (user, searchText) =>
  user.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

const CreateUser = ({ setOpenDialog }) => {
  const { data: options } = useGetAllClientsQuery();
  const [createUser, { isSuccess, isError }] = useCreateUserMutation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: '',
    email: '',
    clients: []
  });

  const [searchText, setSearchText] = useState("");

  const displayedOptions = useMemo(
    () => options?.filter((option) => containsText(option.name, searchText)),
    [options, searchText]
  );

  useEffect(() => {
    if (isSuccess || isError) setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
  }, [isSuccess, isError, setOpenDialog]);

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
    createUser(formData);
    // setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
  };


  return (
    <Box component='form' onSubmit={(e) => handleSubmit(e)}>
      <DialogTitle>
        New User
      </DialogTitle>
      <DialogContent >
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
            </FormControl>
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
                            <Chip label={options.find((user) => value === user.userId).name} />
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
                  {displayedOptions?.map((user, index) => {
                    return (
                      <MenuItem key={index} value={user.userId}>
                        <Checkbox checked={formData.clients.indexOf(user.userId) > -1} />
                        {user.firstName} {user?.lastName}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl> : null}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="success" variant="contained" type="submit">CREATE</Button>
        <Button onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; })}>Cancel</Button>
      </DialogActions>
    </Box>
  );
};

export default CreateUser;