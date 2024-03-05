import React, { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { Backdrop, Box, Button, Checkbox, CircularProgress, Container, FormControl, FormControlLabel, FormGroup, IconButton, Input, InputAdornment, InputLabel, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import LoginIcon from '@mui/icons-material/Login';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useLoginUserMutation } from "../../Redux/user/userApiSlice";
import { selectUser } from "../../Redux/user/userSlice";
import { useSelector } from "react-redux";

const SignIn = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [focus, setFocus] = useState(undefined);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    showPassword: false,
    rememberMe: false
  });

  const match = useMatch('/signin');

  useEffect(() => {
    if (user.status === 'loggedIn' && match.pathname === "/signin") {
      navigate('/notes', { replace: true });
    }
  }, [user.status, match, navigate]);

  const handleFormData = (e) => {
    const { value, name } = e.target;
    setFormData({
      ...formData,
      [name]: value.trim()
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(formData)
      .then((res) => {
        if (!res.error) navigate('/notes', { replace: true });
      })
      .catch((err) => {
        console.error('Signin Error: ', err);
      });
  };

  return (
    <Box component="form" className={`max-w-screen-md w-full flex flex-col justify-center items-center mx-auto h-full`} onSubmit={(e) => handleSubmit(e)}>
      <Backdrop
        open={isLoading}
        className={`z-40`}
      >
        <CircularProgress />
      </Backdrop>
      <Container className={`flex justify-center`}>
        <Grid container spacing={2} xs={10} sm={8} className=" flex flex-col justify-center content-center items-center rounded-md bg-gradient-to-b from-transparent from-5% to-psl-secondary-text dark:to-psl-primary-text shadow-md">
          <Grid sm={8} xs={12} className="flex flex-col justify-center content-center items-center">
            <LoginIcon fontSize="large" className="m-5 text-psl-primary dark:text-psl-secondary-text" />
            <Typography variant="h5" component="h1" className="text-psl-primary dark:text-psl-secondary-text">Sign In</Typography>
          </Grid>
          <Grid sm={8} xs={12} className="flex justify-center">
            <FormControl
              variant="standard"
              className="w-full"
              onFocus={(e) => {
                if (e !== focus) setFocus(e);
                document.activeElement.focus();
              }}
              onBlur={() => {
                setFocus(undefined);
                document.activeElement.blur();
              }}
            >
              <InputLabel
                htmlFor="emailInput"
                name="emailLabel"
                className={`
                ${document.activeElement.name === "email" ? `
                text-psl-active-link
                `: `
                text-psl-primary
                dark:text-psl-secondary-text
                `}`}
              > Email</InputLabel>
              <Input
                id="emailInput"
                name="email"
                type="email"
                disableUnderline
                className={`
                text-psl-primary 
                dark:text-psl-secondary-text
                rounded-sm
                ${document.activeElement.name === "email" ? `
                  border-b-psl-active-link
                  border-0 border-b-2
                  border-solid
                `: `
                  border-0
                  border-solid
                  border-b-2
                  border-b-psl-primary/40
                  dark:border-b-psl-secondary-text/40
                  hover:border-b-psl-active-link
                  hover:dark:border-b-psl-active-link
                `}`}
                value={formData.email}
                onChange={(e) => handleFormData(e)}
              />
            </FormControl>
          </Grid>
          <Grid sm={8} xs={12} className="flex justify-center">
            <FormControl
              variant="standard"
              className="w-full"
              onFocus={(e) => {
                if (e !== focus) setFocus(e);
                document.activeElement.focus();
              }}
              onBlur={() => {
                setFocus(undefined);
                document.activeElement.blur();
              }}
            >
              <InputLabel
                htmlFor="passwordInput"
                className={`
                ${document.activeElement.name === "password" ? `
                text-psl-active-link
                `: `
                text-psl-primary
                dark:text-psl-secondary-text
                `}`}
              >Password</InputLabel>
              <Input
                id="passwordInput"
                name="password"
                type={formData.showPassword ? "text" : 'password'}
                value={formData.password}
                onChange={(e) => handleFormData(e)}
                disableUnderline
                className={`
                text-psl-primary 
                dark:text-psl-secondary-text
                rounded-sm
                ${document.activeElement.name === "password" ? `
                  border-b-psl-active-link
                  border-0 border-b-2
                  border-solid
                `: `
                  border-0
                  border-solid
                  border-b-2
                  border-b-psl-primary/40
                  dark:border-b-psl-secondary-text/40
                  hover:border-b-psl-active-link
                  hover:dark:border-b-psl-active-link
                `}`}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setFormData(prev => {
                        return {
                          ...prev,
                          showPassword: !prev.showPassword
                        };
                      })}
                      edge="end"
                      aria-label="toggle password visibility"
                      className={`
                    ${document.activeElement.name === "password" ? `
                    text-psl-active-link
                    `: `
                    text-psl-primary
                    dark:text-psl-secondary-text 
                    `}`}>
                      {formData.showPassword
                        ? <VisibilityOff />
                        : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid sm={8} xs={12} className="flex justify-center">
            <Button variant="contained" className="m-3 bg-transparent bg-gradient-to-b from-transparent to-psl-secondary-text dark:to-psl-secondary hover:bg-psl-active-link hover:to-psl-active-link hover:dark:to-psl-active-link hover:dark:text-psl-primary text-psl-primary dark:text-psl-secondary-text shadow-none hover:shadow-none" type="Submit">Sign In</Button>
          </Grid>
          <Grid sm={8} xs={12} className="flex justify-center">
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.rememberMe}
                    onChange={() => setFormData(prev => {
                      return {
                        ...prev,
                        rememberMe: !prev.rememberMe
                      };
                    })}
                    checkedIcon=<CheckBoxIcon className="text-psl-active-link" />
                    className="text-psl-primary dark:text-psl-secondary-text"
                  />}
                label="Remember Me?"
                className={`text-psl-primary dark:text-psl-secondary-text`} />
            </FormGroup>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SignIn;