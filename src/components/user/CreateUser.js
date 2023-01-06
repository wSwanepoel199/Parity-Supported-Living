import { Box, Button, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, Input, InputAdornment, InputLabel, MenuItem, Select } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Grid from "@mui/material/Unstable_Grid2/";
import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { useCreateUserMutation } from "../../shared/redux/user/userSlice";


const CreateUser = ({ setOpenDialog }) => {
  // const userState = useSelector(state => state.user);
  const [createUser, { isSuccess, isError }] = useCreateUserMutation();

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    password: '',
    showPassword: false,
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
    setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
  };


  return (
    <Box>
      <DialogTitle>
        New User
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} className="flex justify-center">
          <Grid xs={6} className="flex justify-center">
            <FormControl size="small" fullWidth margin="dense">
              <InputLabel shrink htmlFor="nameInput">Name</InputLabel>
              <Input
                id="nameInput"
                name="name"
                type="text"
                value={formData.name}
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
                value={formData.role}
                onChange={handleInput}
              >
                <MenuItem value={"Admin"}>Admin</MenuItem>
                <MenuItem value={"Carer"}>Carer</MenuItem>
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
                value={formData.email}
                onChange={handleInput}
              />
            </FormControl>
          </Grid>
          <Grid xs={6} className="flex justify-center">
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
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={(e) => handleSubmit(e)}>Create</Button>
        <Button onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; })}>Cancel</Button>
      </DialogActions>
    </Box>
  );
};

export default CreateUser;