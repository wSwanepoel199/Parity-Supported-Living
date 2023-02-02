import { Box } from "@mui/material";
import { GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import GridToolbarImport from "./GridToolbarImport";

const Toolbar = ({ children, type, csvOptions, clearSelect }) => {
  const userState = useSelector(state => state.user.user);

  return (
    <GridToolbarContainer className="justify-between">
      <Box>
        {/* <GridToolbarColumnsButton/> */}
        {/* <GridToolbarFilterButton /> */}
        <GridToolbarDensitySelector />
        {userState.role === "Admin" ? <GridToolbarExport csvOptions={csvOptions} onClick={() => clearSelect([])} /> : null}
        {userState.role === "Admin" ? <GridToolbarImport type={type} /> : null}
      </Box>
      {children}
    </GridToolbarContainer>
  );
};

export default Toolbar;