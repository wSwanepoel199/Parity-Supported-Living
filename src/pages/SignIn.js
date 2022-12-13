import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Unstable_Grid2";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import CloseIcon from '@mui/icons-material/Close';
import { getUser } from "../shared/redux/user/userSlice";

const SignIn = () => {
  const dispatch = useDispatch();
  const userState = useSelector(state => state.user);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    error: undefined,
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
    dispatch(getUser(formData));
  };

  return (
    <Box component="form" className="w-full max-w-screen-md flex justify-center" onSubmit={(e) => handleSubmit(e)}>
      {console.log(userState)}
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
          <TextField label="Email" type="email" variant="standard" className="w-full" name="email" onChange={(e) => handleFormData(e)} value={formData.email}
          />
        </Grid>
        <Grid sm={8} xs={12} className="flex justify-center">
          <TextField label="Password" type="password" variant="standard" className="w-full" name="password" onChange={(e) => handleFormData(e)} value={formData.password}
          />
        </Grid>
        <Grid sm={8} xs={12} className="flex justify-center">
          <Button variant="contained" className="m-3" type="Submit">Sign In</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignIn;