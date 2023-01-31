import { Box, Button, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Input, InputLabel, MenuItem, Select, Switch, } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/";
import { useEffect, useRef, useState } from "react";
import { useUpdateUserMutation } from "../../shared/redux/user/userSlice";
// import { useSelector } from "react-redux";

const UpdateUser = ({ setOpenDialog, user }) => {
  // const userState = useSelector(state => state.user);
  const [updateUser, { isSuccess, isError }] = useUpdateUserMutation();
  const mounted = useRef();
  const [formData, setFormData] = useState({
    showPassword: false,
    resetPassword: true
  });

  useEffect(() => {
    if (!mounted.current) {
      const parsedUser = JSON.parse(JSON.stringify(user).replace(/:null/gi, ":\"\""));
      setFormData(prev => {
        return {
          ...prev,
          ...parsedUser
        };
      });
      mounted.current = true;
    }
    if (isSuccess || isError) setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; });
    return () => {
      mounted.current = false;
    };
  }, [mounted, user, isSuccess, isError, setOpenDialog]);

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
    // setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; });
  };


  return (
    <Box component='form' onSubmit={(e) => handleSubmit(e)}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <DialogTitle>
          Edit Note
        </DialogTitle>
        {/* <FormControlLabel control={<Switch checked={!editForm} onChange={() => setEditForm(prev => !prev)} />} label="Toggle Edit" /> */}
      </Box>
      {mounted.current ?
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
                <InputLabel htmlFor="passwordInput">New Password</InputLabel>
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
          <Button type="submit">Edit</Button>
          <Button onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '' }; })}>Cancel</Button>
        </Box>
      </DialogActions>
    </Box>
  );
};

export default UpdateUser;