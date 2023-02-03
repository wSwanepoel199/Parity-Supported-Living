import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, Input, InputAdornment, InputLabel, useMediaQuery, useTheme } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Appbar from "../components/Appbar";
import { useEffect, useRef, useState } from "react";
import { saveRefreshInterval, useRefreshUserMutation, useResetPassMutation } from "../shared/redux/user/userSlice";
import { useEffectOnce } from "../shared/utils/customHooks";
// import Navbar from "../components/Navbar";

const Landing = () => {
  const mounted = useRef();
  const userState = useSelector(state => state.user);
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [resetPass, { isSuccess }] = useResetPassMutation();
  const [refreshUser] = useRefreshUserMutation();

  const [formData, setFormData] = useState({
    password: '',
    showPassword: false
  });

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    }


    return () => {
      mounted.current = false;
    };
  }, [mounted, isSuccess, refreshUser,]);

  useEffectOnce(() => {
    if (userState.user?.expireTimer && !userState.intervalId) {
      const intervalId = setInterval(refreshUser, userState.user.expireTimer);
      dispatch(saveRefreshInterval(intervalId));
    }
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
    <div className="w-full min-h-screen flex flex-col">
      <Appbar />
      <Dialog
        fullScreen={fullScreen}
        open={userState.user.resetPassword}
        className={`z-30`}
      >
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
      </Dialog>

      {/* <Dialog
        fullScreen={fullScreen}
        open={openDialog.open}
      // onClose={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; })}
      >
        {
          openDialog.open
            ? (openDialog.type === "new" && <CreateUser setOpenDialog={setOpenDialog} />) || (openDialog.type === "edit" && <UpdateUser setOpenDialog={setOpenDialog} user={openDialog.data} />) || (openDialog.type === "delete" && <ConfirmDialog setOpenDialog={setOpenDialog} user={openDialog.data} />)
            : null
        }
      </Dialog> */}
      {!userState.user.resetPassword ?
        <div className={`p-5`}>
          <Outlet />
        </div> : null}
      <Button onClick={refreshUser}>Refresh</Button>
    </div>
  );
};

export default Landing;