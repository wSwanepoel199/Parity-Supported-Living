import { Box, Button, DialogActions, DialogContent, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { useCreateUserMutation } from "../../shared/redux/user/userSlice";


const CreateUser = ({ setOpenDialog }) => {
  // const userState = useSelector(state => state.user);
  const [createUser, { isSuccess, isError }] = useCreateUserMutation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: '',
    email: '',
  });

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
      <DialogContent>
        <Grid container spacing={2} className="flex justify-center">
          <Grid xs={6} className="flex justify-center">
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
          <Grid xs={6} className="flex justify-center">
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
          <Grid xs={6} className="flex justify-center">
            <FormControl variant="standard" size="small" fullWidth margin="dense">
              <InputLabel htmlFor="roleInput">Role</InputLabel>
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
          <Grid xs={6} className="flex justify-center">
            <FormControl size="small" fullWidth margin="dense">
              <InputLabel htmlFor="emailInput">Email</InputLabel>
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
          {/* <Grid xs={6} className="flex justify-center">
            <FormControl size="small" fullWidth margin="dense">
              <InputLabel htmlFor="passwordInput">Password</InputLabel>
              <Input
                id="passwordInput"
                name="password"
                type={formData.showPassword ? "text" : 'password'}
                value={formData.password}
                onChange={handleInput}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={() => setFormData(prev => { return { ...prev, showPassword: !prev.showPassword }; })} edge="end" aria-label="toggle password visibility">
                      {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid> */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="submit">Create</Button>
        <Button onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; })}>Cancel</Button>
      </DialogActions>
    </Box>
  );
};

export default CreateUser;