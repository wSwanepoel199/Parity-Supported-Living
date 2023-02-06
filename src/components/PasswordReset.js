import { Box, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, Input, InputAdornment, InputLabel } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useResetPassMutation } from "../shared/redux/user/userSlice";

const PasswordReset = () => {
  const userState = useSelector(state => state.user);
  const [resetPass] = useResetPassMutation();

  const [formData, setFormData] = useState({
    password: '',
    showPassword: false
  });

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
    resetPass({ password: formData.password, userId: userState.user.userId });
  };

  return (
    <Box>
      <DialogTitle>Change Password</DialogTitle>
      <Box component="form" onSubmit={(e) => handleSubmit(e)}>
        <DialogContent>
          <DialogContentText>
            Please change your password to a more secure one
          </DialogContentText>
          <FormControl size="small" fullWidth margin="dense">
            <InputLabel htmlFor="passwordInput">New Password</InputLabel>
            <Input
              id="passwordInput"
              name="password"
              required
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
        </DialogContent>
        <DialogActions>
          <Button type="submit">Update Password</Button>
        </DialogActions>
      </Box>
    </Box>
  );
};

export default PasswordReset;