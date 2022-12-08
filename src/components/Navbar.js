import { useDispatch } from "react-redux";
import { removeUser } from "../shared/redux/user/userSlice";
import { Button } from "@mui/material";
import api from "../shared/utils/api";

const Navbar = () => {
  const dispatch = useDispatch();

  const signOut = () => {
    api('get', '/auth/logout')
      .then(dispatch(removeUser()));
  };

  return (
    <div className="bg-neutral-500 w-full h-screen flex">
      <div>
        <h2>NavBar</h2>
        <Button onClick={() => signOut()}>Sign Out</Button>
      </div>
    </div>
  );
};

export default Navbar;