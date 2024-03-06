import { Box } from "@mui/material";
import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import { memo } from "react";
import { useSelector } from "react-redux";

import GridToolbarImport from "./GridToolbarImport";
import { selectUser } from "../../Redux/user/userSlice";

const Toolbar = ({ children, type, csvOptions, clearSelect, setFilterButtonEl }) => {
  const user = useSelector(selectUser);

  return (
    <GridToolbarContainer
      className="flex justify-between w-full bg-gradient-to-b from-psl-active-text dark:from-psl-primary to-transparent"
      onClick={(e) => {
        setFilterButtonEl(e.target);
      }}
    >
      <Box className={`flex flex-wrap justify-start`}>
        <GridToolbarColumnsButton
          className={`text-psl-active-link`}
        />
        <GridToolbarFilterButton
          className={`text-psl-active-link`}
        />
        <GridToolbarDensitySelector className={`text-psl-active-link`} />
        <Box >
          {user.user.role === "Admin" ?
            <GridToolbarExport
              csvOptions={csvOptions}
              onClick={() => clearSelect([])}
              className={`text-psl-active-link`}
            /> : null}
          {(user.user.role === "Admin") ?
            <GridToolbarImport
              type={type}
            /> : null}
        </Box>
      </Box>
      <Box className={`ml-auto mr-[4px]`}>
        {children}
      </Box>
    </GridToolbarContainer>
  );
};

export default memo(Toolbar);