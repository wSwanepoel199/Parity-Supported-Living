import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Landing = () => {
  return (
    <div className="w-full h-full flex">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Landing;