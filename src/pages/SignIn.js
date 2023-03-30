import React, { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, IconButton, Input, InputAdornment, InputLabel, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useLoginUserMutation } from "../shared/redux/user/userApiSlice";

import LoginIcon from '@mui/icons-material/Login';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// const LoginIcon = lazy(() => import('@mui/icons-material/Login'));
// const Visibility = lazy(() => import('@mui/icons-material/Visibility'));
// const VisibilityOff = lazy(() => import('@mui/icons-material/VisibilityOff'));

const SignIn = () => {
  const navigate = useNavigate();
  const [loginUser, { data, isSuccess }] = useLoginUserMutation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    showPassword: false,
    rememberMe: false
  });

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
  }, [data, isSuccess, navigate]);

  return (
    <Box component="form" className="w-full max-w-screen-md my-auto flex justify-center" onSubmit={(e) => handleSubmit(e)}>
      <Grid container spacing={2} xs={10} sm={8} className="flex flex-col justify-center content-center items-center bg-slate-200 border-2 border-solid border-black rounded-md">
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

export default memo(SignIn);