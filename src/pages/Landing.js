import { Button, Dialog, useMediaQuery, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Appbar from "../components/Appbar";
import { useRefreshUserMutation } from "../shared/redux/user/userApiSlice";
import PasswordReset from "../components/PasswordReset";
import { useGetAllClientsQuery } from "../shared/redux/client/clientApiSlice";
import { useGetAllUsersQuery } from "../shared/redux/admin/adminApiSlice";
import { useGetPostsQuery } from "../shared/redux/posts/postApiSlice";
import { memo } from "react";

const Landing = () => {
  const userState = useSelector(state => state.user);
  const skip = userState.user.role !== ("Admin" || "Coordinator");
  useGetAllClientsQuery(undefined, { refetchOnMountOrArgChange: true });
  useGetAllUsersQuery(undefined, { skip, refetchOnMountOrArgChange: true });
  useGetPostsQuery(undefined, { refetchOnMountOrArgChange: true });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [refreshUser] = useRefreshUserMutation();


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

      {!userState.user.resetPassword ?
        <div className={`p-5`}>
          <Outlet />
        </div> : null}
      {process.env.NODE_ENV === 'development' ? <Button onClick={refreshUser}>Refresh</Button> : null}
    </div>
  );
};

export default memo(Landing);