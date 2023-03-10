import { Dialog, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { useGetAllClientsQuery } from "../shared/redux/client/clientApiSlice";
import { useGetAllUsersQuery } from "../shared/redux/admin/adminApiSlice";
import { useGetPostsQuery } from "../shared/redux/posts/postApiSlice";
import { lazy, memo } from "react";

// import PasswordReset from "../components/PasswordReset";
const PasswordReset = lazy(() => import("../components/PasswordReset"));

// import Appbar from "../components/Appbar";

const Landing = () => {
  const userState = useSelector(state => state.user);
  const skip = userState.user.role !== ("Admin" || "Coordinator");
  useGetAllClientsQuery(undefined, { refetchOnMountOrArgChange: true });
  useGetAllUsersQuery(undefined, { skip, refetchOnMountOrArgChange: true });
  useGetPostsQuery(undefined, { refetchOnMountOrArgChange: true });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


  return (
    <div className="w-full self-start pb-6">
      {/* <Appbar /> */}
      <Dialog
        fullScreen={fullScreen}
        open={userState.user.resetPassword}
        className={`z-30`}
      >
        <PasswordReset />
      </Dialog>

      {!userState.user.resetPassword ?
        <Stack>
          <Outlet />
        </Stack> : null}
    </div>
  );
};

export default memo(Landing);