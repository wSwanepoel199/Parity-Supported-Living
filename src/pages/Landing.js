import { Outlet } from "react-router-dom";

const Landing = () => {
  return (
    <div className="w-full h-full bg-slate-400 flex justify-center content-center items-center">
      <Outlet />
    </div>
  );
};

export default Landing;