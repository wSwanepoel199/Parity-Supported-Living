import { Button, Dialog, useMediaQuery, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Appbar from "../components/Appbar";
import { useEffect, useRef } from "react";
import { useRefreshUserMutation } from "../shared/redux/user/userApiSlice";
// import { saveRefreshInterval } from "../shared/redux/user/userSlice";
// import { useEffectOnce } from "../shared/utils/customHooks";
import PasswordReset from "../components/PasswordReset";
// import Navbar from "../components/Navbar";

const Landing = () => {
  const mounted = useRef();
  const userState = useSelector(state => state.user);
  // const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [refreshUser] = useRefreshUserMutation();

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    }


    return () => {
      mounted.current = false;
    };
  }, [mounted, refreshUser]);

  // useEffectOnce(() => {
  //   if (userState.user?.expireTimer && !userState.intervalId) {
  //     const intervalId = setInterval(refreshUser, userState.user.expireTimer);
  //     dispatch(saveRefreshInterval(intervalId));
  //   }
  // });


  return (
    <div className="w-full min-h-screen flex flex-col">
      <Appbar />
      <Dialog
        fullScreen={fullScreen}
        open={userState.user.resetPassword}
        className={`z-30`}
      >
        <PasswordReset />
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
      {process.env.NODE_ENV === 'development' ? <Button onClick={refreshUser}>Refresh</Button> : null}
    </div>
  );
};

export default Landing;