import { memo, } from "react";
import { Outlet } from "react-router-dom";
import { Dialog, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useSelector } from "react-redux";
import { useGetAllClientsQuery } from "../../Redux/client/clientApiSlice";
import { useGetAllUsersQuery } from "../../Redux/admin/adminApiSlice";
import { useGetPostsQuery } from "../../Redux/posts/postApiSlice";

import { PasswordReset } from "../../Components/";
// const { PasswordReset } = lazy(() => import("../../Components"));

// import Appbar from "../components/Appbar";

const Landing = () => {
  const userState = useSelector(state => state.user);
  // const skipQuery = useRef(userState.status === 'loggedIn');
  const skipUsers = userState.user?.role !== ("Admin" || "Coordinator");
  useGetAllClientsQuery(undefined, { refetchOnMountOrArgChange: true });
  useGetAllUsersQuery(undefined, { skip: skipUsers, refetchOnMountOrArgChange: true });
  useGetPostsQuery(undefined, { refetchOnMountOrArgChange: true });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // useEffect(() => {
  //   console.log(skipQuery, skipUsers);
  // }, [skipQuery, skipUsers]);
  // z-30
  return (
    <div className="w-full self-start pb-6">
      {/* <Appbar /> */}
      <Dialog
        fullScreen={fullScreen}
        open={userState.user?.resetPassword}
        className={``}
      >
        <PasswordReset />
      </Dialog>

      {!userState.user?.resetPassword ?
        <Stack>
          <Outlet />
        </Stack> : null}
    </div>
  );
};

export default memo(Landing);