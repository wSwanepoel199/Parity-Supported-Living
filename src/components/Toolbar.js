import { Box } from "@mui/material";
import { GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import { useSelector } from "react-redux";

const Toolbar = ({ children }) => {
  const userState = useSelector(state => state.user.user);

  return (
    <GridToolbarContainer className="justify-between">
      <Box>
        {/* <GridToolbarColumnsButton/> */}
        {/* <GridToolbarFilterButton /> */}
        <GridToolbarDensitySelector />
        {userState.role === "Admin" ? <GridToolbarExport /> : null}
      </Box>
      {children}
    </GridToolbarContainer>
  );
};

export default Toolbar;