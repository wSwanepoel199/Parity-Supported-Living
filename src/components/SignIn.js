import React, { useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import CloseIcon from '@mui/icons-material/Close';
import api from "../shared/utils/api";
import { storeAuthToken } from "../shared/utils/authToken";

const SignIn = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    error: undefined,
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
    console.log(formData);
    api("post", '/auth/login', { data: formData })
      .then((data) => {
        console.log(data);
        storeAuthToken(data.data.accessToken);
        setFormData({
          email: '',
          password: '',
          error: undefined
        });
      })
      .catch(err => {
        console.log(err);
        setFormData({
          ...formData,
          error: err.msg
        });
      });
  };

  return (
    <Box component="form" className="w-full max-w-screen-md flex justify-center">
      {console.log(formData)}
      <Grid container spacing={2} xs={10} sm={8} className="flex flex-col justify-center content-center items-center bg-slate-200 border-2 border-solid border-black rounded-md">
        {formData.error ?
          <Grid sm={8} xs={12} className="w-full bg-red-500 flex justify-between items-center">
            <Typography variant="body1">{formData.error.message}</Typography>
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
          <TextField label="Email" type="email" variant="standard" className="w-full" name="email" onChange={(e) => handleFormData(e)} value={formData.email}
          />
        </Grid>
        <Grid sm={8} xs={12} className="flex justify-center">
          <TextField label="Password" type="password" variant="standard" className="w-full" name="password" onChange={(e) => handleFormData(e)} value={formData.password}
          />
        </Grid>
        <Grid sm={8} xs={12} className="flex justify-center">
          <Button variant="contained" onClick={(e) => handleSubmit(e)} className="m-3">Sign In</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignIn;