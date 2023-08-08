import { memo } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUser } from "../Redux/user/userSlice";

const ProtectedRoute = ({ children }) => {
  const user = useSelector(selectUser);

  return (
    <>
      {(user.status === "loggedIn" && ["Admin", "Coordinator"].includes(user.user.role)) ? children : <Navigate to='..' replace />}
    </>
  );
};

export default memo(ProtectedRoute);