import Grid from "@mui/material/Unstable_Grid2";
import Navbar from "./Navbar";

const Dashboard = () => {

  return (
    <div className="w-full h-full">
      <Grid container xs={12}>
        <Grid sm={1} xs={2}>
          <Navbar />
        </Grid>
        <Grid sm={11} xs={10}>
          <div className="w-full flex">
            <h1>Dash Board</h1>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;