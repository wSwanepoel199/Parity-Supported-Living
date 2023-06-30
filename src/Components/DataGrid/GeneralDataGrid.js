import { Button, LinearProgress, useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from "@mui/x-data-grid";

import Toolbar from "./Toolbar";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { selectUsers } from "../../Redux/admin/adminSlice";
import { selectPosts } from "../../Redux/posts/postSlice";
import { selectClients } from "../../Redux/client/clientSlice";


const GeneralDataGrid = ({ functions, variables }) => {
  const { setSelectedRow, handleContextMenu, setOpenDialog } = functions;
  const { table, selectedRow, permissions, initialState, settings } = variables;
  const admin = useSelector(selectUsers);
  const posts = useSelector(selectPosts);
  const clients = useSelector(selectClients);
  const navigate = useNavigate();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0
  });

  return (
    <DataGrid
      {...table}
      aria-label="notesDataGrid"
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      pageSizeOptions={[10, 20, 30]}
      pagination
      autoHeight
      disableSelectionOnClick
      hideFooterSelectedRowCount
      selectionModel={selectedRow}
      slots={{
        toolbar: Toolbar,
        loadingOverlay: LinearProgress,
      }}
      slotProps={{
        toolbar: {
          children: (
            <Button
              startIcon={<AddIcon />}
              className={`${!permissions.create && "hidden"} text-psl-active-link`}
              onClick={() => {
                navigate('./new');
                setOpenDialog(prev => {
                  return {
                    ...prev,
                    open: true,
                    type: 'new'
                  };
                });
              }}>{settings.button}</Button>),
          type: settings.type,
          csvOptions: { allColumns: true },
          clearSelect: setSelectedRow
        },
        row: {
          onContextMenu: fullScreen ? handleContextMenu : null,
          style: fullScreen && { cursor: 'context-menu' },
        },
        pagination: {
          className: 'text-psl-primary dark:text-psl-secondary-text',
          SelectProps: {
            classes: {
              icon: 'text-psl-primary dark:text-psl-secondary-text'
            },
            MenuProps: {
              PopoverClasses: {
                paper: 'bg-inherit'
              },
              MenuListProps: {
                classes: {
                  root: 'text-psl-primary-text dark:text-psl-active-text'
                },
                className: 'dark:bg-psl-primary bg-psl-active-text'
              }
            }
          }
        }
      }}
      classes={{
        columnSeparator: 'hidden',
        columnHeader: 'border-0 border-x-[1px] border-solid first:border-l-0 last:border-r-0 border-psl-primary-text/40 dark:border-psl-secondary-text/40 max-h-8 px-2',
        withBorderColor: 'border-psl-primary-text/30 dark:border-psl-secondary-text/30',
        cell: 'text-psl-primary dark:text-psl-secondary-text',
        columnHeaderTitleContainerContent: 'text-psl-primary dark:text-psl-secondary-text',
        sortIcon: 'text-psl-primary dark:text-psl-secondary-text',
        main: 'shadow-inner'
      }}
      className={`bg-psl-primary-text/20 dark:bg-psl-secondary-text/20 border-0 shadow-lg`}
      loading={(posts.status || admin.status || clients.status) === "loading"}
      initialState={initialState}
    />
  );
};

export default GeneralDataGrid;