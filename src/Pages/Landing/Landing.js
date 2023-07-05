import { Suspense, useEffect, } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Backdrop, CircularProgress, Dialog, useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useSelector } from "react-redux";
import { useGetAllClientsQuery } from "../../Redux/client/clientApiSlice";
import { useGetAllUsersQuery } from "../../Redux/admin/adminApiSlice";
import { useGetPostsQuery } from "../../Redux/posts/postApiSlice";

import { PasswordReset } from "../../Components/";
import { selectUser } from "../../Redux/user/userSlice";
// const { PasswordReset } = lazy(() => import("../../Components"));

// import Appbar from "../components/Appbar";

const Landing = () => {
  const user = useSelector(selectUser);
  // const skipQuery = useRef(userState.status === 'loggedIn');
  const navigate = useNavigate();
  const skipUsers = user.user?.role !== ("Admin" || "Coordinator");
  const skipFetch = user.status !== "loggedIn";
  useGetAllClientsQuery(undefined, { skip: skipFetch, refetchOnMountOrArgChange: true });
  useGetAllUsersQuery(undefined, { skip: skipUsers, refetchOnMountOrArgChange: true });
  useGetPostsQuery(undefined, { skip: skipFetch, refetchOnMountOrArgChange: true });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // useEffect(() => {
  //   console.log(skipQuery, skipUsers);
  // }, [skipQuery, skipUsers]);

  useEffect(() => {
    if (user.status !== "loggedIn") {
      navigate('/signin');
    }

  }, [user.status, navigate]);

  return (
    <div className="w-full pb-6">
      {/* <Appbar /> */}
      <Dialog
        fullScreen={fullScreen}
        open={Boolean(user.user?.resetPassword)}
        className={`z-30`}
        classes={{
          paper: 'bg-transparent'
        }}
      >
        <PasswordReset />
      </Dialog>
      <Suspense fallback={
        <Backdrop
          open={true}
          className={`z-40`}
        >
          <CircularProgress />
        </Backdrop>
      }>
        {!user.user?.resetPassword ?
          <Outlet />
          : null}
      </Suspense>
    </div>
  );
};

export default Landing;