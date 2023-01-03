import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Unstable_Grid2";
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, IconButton, Input, InputAdornment, InputLabel, Typography } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useSelector } from "react-redux";
import { useLoginUserMutation } from "../shared/redux/user/userSlice";

const SignIn = () => {
  const userState = useSelector(state => state.user);
  const navigate = useNavigate();
  const [loginUser, { data, error, isSuccess, isError }] = useLoginUserMutation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    error: undefined,
    showPassword: false,
    rememberMe: false
  });

  useEffect(() => {
    setFormData(prev => {
      return {
        ...prev,
        error: userState.error || undefined
      };
    });
  }, [userState]);

  const handleFormData = (e) => {
    const { value, name } = e.target;
    setFormData({
      ...formData,
      [name]: value.trim()
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      navigate('/');
    }
    if (isError) {
      setFormData(prev => {
        return {
          ...prev,
          error: error.data.message
        };

      });
    }
  }, [data, error, isSuccess, navigate, isError]);

  return (
    <Box component="form" className="w-full max-w-screen-md flex justify-center" onSubmit={(e) => handleSubmit(e)}>
      <Grid container spacing={2} xs={10} sm={8} className="flex flex-col justify-center content-center items-center bg-slate-200 border-2 border-solid border-black rounded-md">
        {formData.error ?
          <Grid sm={8} xs={12} className="w-full bg-red-500 flex justify-between items-center">
            <Typography variant="body1">{formData.error}</Typography>
            <IconButton onClick={() => setFormData({ ...formData, error: undefined })}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Grid>
          :
          null}
        <Grid sm={8} xs={12} className="flex flex-col justify-center content-center items-center">
          <LoginIcon fontSize="large" className="m-5" />
          <Typography variant="h5" component="h1">Sign In</Typography>
        </Grid>
        <Grid sm={8} xs={12} className="flex justify-center">
          <FormControl variant="standard" className="w-full">
            <InputLabel htmlFor="emailInput">Email</InputLabel>
            <Input
              id="emailInput"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleFormData(e)}
            />
          </FormControl>
        </Grid>
        <Grid sm={8} xs={12} className="flex justify-center">
          <FormControl variant="standard" className="w-full">
            <InputLabel htmlFor="passwordInput">Password</InputLabel>
            <Input
              id="passwordInput"
              name="password"
              type={formData.showPassword ? "text" : 'password'}
              value={formData.password}
              onChange={(e) => handleFormData(e)}
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
        <Grid sm={8} xs={12} className="flex justify-center">
          <Button variant="contained" className="m-3" type="Submit">Sign In</Button>
        </Grid>
        <Grid sm={8} xs={12} className="flex justify-center">
          <FormGroup>
            <FormControlLabel control={<Checkbox checked={formData.rememberMe} onChange={() => setFormData(prev => { return { ...prev, rememberMe: !prev.rememberMe }; })} />} label="Remember Me?" />
          </FormGroup>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignIn;