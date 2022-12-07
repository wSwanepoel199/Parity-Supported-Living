import { Button } from "@mui/material";
import { removeStoredToken } from "../shared/utils/authToken";

const Navbar = () => {

  const signOut = () => {
    removeStoredToken();
  };

  return (
    <div className="bg-neutral-500 w-full h-screen flex">
      <div>
        <h2>NavBar</h2>
        <Button onClick={signOut()}>Sign Out</Button>
      </div>
    </div>
  );
};

export default Navbar;