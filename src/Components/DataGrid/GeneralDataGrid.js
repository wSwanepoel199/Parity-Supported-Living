import { Box, Button, Dialog, IconButton, LinearProgress, ListItemIcon, ListItemText, Menu, MenuItem, useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DataGrid } from "@mui/x-data-grid";
import { memo, useMemo, useState } from "react";
import Toolbar from "./Toolbar";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const GeneralDataGrid = ({ intialTable, NewEntry, type, optionPermissions, tableArray, columns, sorting }) => {
  const rootState = useSelector(state => state.root);

  const navigate = useNavigate();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [table, setTable] = useState({
    columns: [],
    rows: [],
    pageSize: 10
  });

  const [permissions, setPermissions] = useState({
    create: false,
    edit: false,
    view: false,
    delete: false,
  });

  useMemo(() => {
    setTable((prev) => {
      if (intialTable?.columns?.length > 0) return {
        ...prev,
        ...intialTable,
        columns: [
          ...intialTable.columns,
          {
            field: 'options',
            headerName: "Options",
            width: permissions.edit ? 130 : 70,
            disableColumnMenu: true,
            disableColumnFilter: true,
            sortable: false,
            renderCell: (params) => (
              <Box className={`flex justify-center`}>
                <IconButton onClick={() => {
                  setSelectedRow(params.row.id);
                  setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'view', data: params.row }; });
                }} className={`dark:text-white`}>
                  <VisibilityIcon />
                </IconButton>
                {permissions.edit ? <IconButton onClick={() => {
                  setSelectedRow(params.row.id);
                  setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'edit', data: params.row }; });
                }} className={`dark:text-white`}>
                  <EditIcon />
                </IconButton> : null}
                {permissions.delete ? <IconButton onClick={() => {
                  setSelectedRow(params.row.id);
                  setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'delete', data: params.row }; });
                }} className={`dark:text-white`}>
                  <DeleteIcon />
                </IconButton> : null}
              </Box>
            ),
            disableExport: true
          }]
      };
    });
  }, [intialTable, permissions]);

  useMemo(() => {
    setPermissions(optionPermissions);
  }, [optionPermissions]);

  const [tableState, setTableState] = useState({});

  useMemo(() => {
    setTableState(prev => {
      return {
        ...prev,
        columns,
        sorting
      };
    });
  }, [columns, sorting]);

  const [openDialog, setOpenDialog] = useState({
    open: false,
    type: '',
    data: {}
  });

  // const handleDialog = (type, row) => {
  //   setOpenDialog({ ...openDialog, open: !openDialog.open, type: type, data: row });
  // };

  const [selectedRow, setSelectedRow] = useState();

  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setSelectedRow(Number(event.currentTarget.getAttribute('data-id')));
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const openView = (array) => {
    array.map((row) => {
      if (row.id === selectedRow) {
        setOpenDialog({ ...openDialog, open: !openDialog.open, type: 'view', data: row });
      }
      return row;
    });
    handleClose();
  };

  const openEdit = (array) => {
    array.map((row) => {
      if (row.id === selectedRow) {
        setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'edit', data: row }; });
      }
      return row;
    });
    handleClose();
  };

  const openDelete = (array) => {
    array.map((row) => {
      if (row.id === selectedRow) {
        setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'delete', data: row }; });
      }
      return row;
    });
    handleClose();
  };

  return (
    <>
      <DataGrid
        {...table}
        onPageSizeChange={(newPageSize) => setTable(prev => {
          return {
            ...prev,
            pageSize: newPageSize,
          };
        })}
        rowsPerPageOptions={[10, 20, 30]}
        pagination
        autoHeight
        disableSelectionOnClick
        hideFooterSelectedRowCount
        selectionModel={selectedRow}
        components={{
          Toolbar: Toolbar,
          LoadingOverlay: LinearProgress,
        }}
        componentsProps={{
          toolbar: {
            children: (<NewEntry startIcon={<AddIcon />} className={`${!permissions.create && "hidden"}`} onClick={() => {
              navigate('/notes/new');
              setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'new' }; });
            }} />),
            type,
            csvOptions: { allColumns: true },
            clearSelect: setSelectedRow
          },
          row: {
            onContextMenu: fullScreen ? handleContextMenu : null,
            style: fullScreen && { cursor: 'context-menu' },
          },
        }}
        loading={rootState.status === "loading"}
        className="bg-slate-300"
        initialState={{ ...tableState }}
      />
    </>
  );
};

export default GeneralDataGrid;