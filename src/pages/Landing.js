import { Outlet } from "react-router-dom";
import Appbar from "../components/Appbar";
// import Navbar from "../components/Navbar";

const Landing = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <Appbar />
      <Outlet />
    </div>
  );
};

export default Landing;