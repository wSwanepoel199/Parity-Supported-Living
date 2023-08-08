import { Backdrop, Box, Button, CircularProgress, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, Input, InputAdornment, InputLabel } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { useResetPassMutation } from "../Redux/user/userApiSlice";
import { selectUser } from "../Redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const PasswordReset = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [resetPass, { isSuccess, isLoading }] = useResetPassMutation();

  const [formData, setFormData] = useState({
    password: '',
    showPassword: false
  });
  const [focus, setFocus] = useState(undefined);

  const handleInput = (e) => {
    const { value } = e.target;
    setFormData(prev => {
      return {
        ...prev,
        password: value
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    delete formData.showPassword;
    resetPass({ password: formData.password, userId: user.user.userId }).then(() => {
      if (isSuccess) navigate('/notes');
    });
  };

  return (
    <>
      <Backdrop
        open={isLoading}
        className={`z-40`}
      >
        <CircularProgress />
      </Backdrop>

      <Box className={`dialog-background h-full flex flex-col justify-center p-2 `}>
        <Box component="form" onSubmit={(e) => handleSubmit(e)} className={`sm:px-10 `}>
          <DialogTitle className={`text-psl-primary dark:text-psl-active-text`}>Change Password</DialogTitle>
          <DialogContent>
            <DialogContentText className={`text-psl-primary-text dark:text-psl-secondary-text`}>
              Please enter a new Password
            </DialogContentText>
            <FormControl
              variant="standard"
              size="small"
              fullWidth
              margin="dense"
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
                onChange={(e) => handleInput(e)}
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
          </DialogContent>
          <DialogActions>
            <Button type="submit" variant="contained" className="m-3 bg-transparent bg-gradient-to-b from-transparent to-psl-secondary-text dark:to-psl-secondary hover:bg-psl-active-link hover:to-psl-active-link hover:dark:to-psl-active-link hover:dark:text-psl-primary text-psl-primary dark:text-psl-secondary-text shadow-none hover:shadow-none">Update Password</Button>
          </DialogActions>
        </Box>
      </Box>
    </>
  );
};

export default memo(PasswordReset);