import { useDispatch } from "react-redux";
import { removeUser } from "../shared/redux/user/userSlice";
import { Button } from "@mui/material";

const Navbar = () => {
  const dispatch = useDispatch();

  return (
    <div className="bg-neutral-500 w-full h-screen flex">
      <div>
        <h2>NavBar</h2>
        <Button onClick={() => dispatch(removeUser())}>Sign Out</Button>
      </div>
    </div>
  );
};

export default Navbar;