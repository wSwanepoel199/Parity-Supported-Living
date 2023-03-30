import { memo } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userState = useSelector(state => state.user);

  return (
    <>
      {(userState.status === "loggedIn" && ["Admin", "Coordinator"].includes(userState.user.role)) ? children : <Navigate to='/' replace />}
    </>
  );
};

export default memo(ProtectedRoute);