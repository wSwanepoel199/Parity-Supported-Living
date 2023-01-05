import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userState = useSelector(state => state.user);

  return (
    <>
      {(userState.status === "loggedIn" && userState.user.role === "Admin") ? children : <Navigate to="/" replace />}
    </>
  );
};

export default ProtectedRoute;