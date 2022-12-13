import { useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../shared/utils/api";
import { fetchStoredToken } from "../shared/utils/authToken";

const Dashboard = () => {
  const user = useSelector(state => state.user.user);

  // useEffect(() => {
  //   if (fetchStoredToken()) {
  //     api('get', '/posts')
  //       .then(data => console.log(data))
  //       .catch(err => console.log(err));
  //   }
  // }, []);

  return (
    <div className="w-full h-full">
      <h1>Dash Board</h1>
    </div>
  );
};

export default Dashboard;