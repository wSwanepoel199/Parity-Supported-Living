import { Outlet } from "react-router-dom";
import Appbar from "../components/Appbar";
// import Navbar from "../components/Navbar";

const Landing = () => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Appbar />
      <div className={`p-5`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Landing;