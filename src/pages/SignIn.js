import React, { useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Box, Button, TextField, Typography } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';

const SignIn = () => {

  const [formData, setFormData] = useState({
    email: undefined,
    password: undefined,
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
    fetch('http://192.168.56.101:5000/auth/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.status >= 400) {
          setFormData({
            ...formData,
            error: data.msg
          });
        } else {
          setFormData({
            email: undefined,
            password: undefined,
            error: undefined
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className="w-full h-full bg-slate-400 flex justify-center content-center items-center">
      {console.log(formData)}
      <Box component="form" className="w-full max-w-screen-md flex justify-center">
        <Grid container spacing={2} xs={10} sm={8} className="flex flex-col justify-center content-center items-center bg-slate-200 border-2 border-solid border-black rounded-md">
          {formData.error ?
            <Grid sm={8} xs={12} className="w-full bg-red-500 rounded-md flex">
              <Typography variant="body1">{formData.error.message}</Typography>
            </Grid>
            :
            null}
          <Grid sm={8} xs={12} className="flex flex-col justify-center content-center items-center">
            <LoginIcon fontSize="large" className="m-5" />
            <Typography variant="h5" component="h1">Sign In</Typography>
          </Grid>
          <Grid sm={8} xs={12} className="flex justify-center">
            <TextField label="Email" variant="standard" className="w-full" name="email" onChange={(e) => handleFormData(e)} value={formData.name}
            />
          </Grid>
          <Grid sm={8} xs={12} className="flex justify-center">
            <TextField label="Password" variant="standard" className="w-full" name="password" onChange={(e) => handleFormData(e)} value={formData.name}
            />
          </Grid>
          <Grid sm={8} xs={12} className="flex justify-center">
            <Button variant="contained" onClick={(e) => handleSubmit(e)} className="m-3">Sign In</Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default SignIn;