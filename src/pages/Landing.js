import React, { useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Box, Button, TextField, Typography } from "@mui/material";

const Landing = () => {

  const [formData, setFormData] = useState({
    email: null,
    password: null
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
      .then(data => console.log(data))
      .catch(err => console.log(err));
  };

  return (
    <div className="w-full h-full bg-slate-400 flex justify-center content-center">
      {console.log(formData)}
      <Box className="flex flex-col justify-center content-center items-center w-full">
        <Typography variant="h5" component="h1">Sign In</Typography>
        <Box component="form" className="w-full flex justify-center">
          <Grid container spacing={2} xs={10} sm={8} className="flex flex-col justify-center content-center">
            <Grid sm={8} xs={12} className="flex justify-center">
              <TextField label="Email" variant="standard" className="w-full" name="email" onChange={(e) => handleFormData(e)} value={formData.name}
                error={formData.email === null || formData.email.trim().length !== 0 ? false : true}
                helperText={formData.email === null || formData.email.trim().length !== 0 ? "" : "Must provide an email"}
              />
            </Grid>
            <Grid sm={8} xs={12} className="flex justify-center">
              <TextField label="Password" variant="standard" className="w-full" name="password" onChange={(e) => handleFormData(e)} value={formData.name}
                error={formData.password === null || formData.password.trim().length !== 0 ? false : true}
                helperText={formData.password === null || formData.password.trim().length !== 0 ? "" : "Must provide a password"}
              />
            </Grid>
            <Grid sm={8} xs={12} className="flex justify-center">
              <Button variant="contained" onClick={(e) => handleSubmit(e)}>Sign In</Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default Landing;