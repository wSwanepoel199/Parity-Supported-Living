import { Box } from "@mui/material";
import { GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import GridToolbarImport from "./GridToolbarImport";

const Toolbar = ({ children, type, csvOptions, clearSelect }) => {
  const userState = useSelector(state => state.user.user);

  return (
    <GridToolbarContainer className="flex justify-between w-full">
      <Box className={`flex flex-wrap justify-start`}>
        {/* <GridToolbarColumnsButton/> */}
        {/* <GridToolbarFilterButton /> */}
        <GridToolbarDensitySelector />
        <Box >
          {userState.role === "Admin" ? <GridToolbarExport csvOptions={csvOptions} onClick={() => clearSelect([])} /> : null}
          {(userState.role === "Admin" && type !== 'client') ? <GridToolbarImport type={type} /> : null}
        </Box>
      </Box>
      <Box className={`ml-auto mr-[4px]`}>
        {children}
      </Box>
    </GridToolbarContainer>
  );
};

export default Toolbar;