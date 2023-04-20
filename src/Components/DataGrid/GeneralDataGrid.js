import { Box, Dialog, IconButton, LinearProgress, ListItemIcon, ListItemText, Menu, MenuItem, useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DataGrid } from "@mui/x-data-grid";
import { memo, useMemo, useState } from "react";
import Toolbar from "./Toolbar";
import { useSelector } from "react-redux";

const GeneralDataGrid = ({ intialTable, NewEntry, type, dialogOptions, optionPermissions, tableArray, columns, sorting }) => {
  const rootState = useSelector(state => state.root);

  const { Create, View, Update, Delete } = dialogOptions;

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
                }} >
                  <VisibilityIcon />
                </IconButton>
                {permissions.edit ? <IconButton onClick={() => {
                  setSelectedRow(params.row.id);
                  setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'edit', data: params.row }; });
                }}>
                  <EditIcon />
                </IconButton> : null}
                {permissions.delete ? <IconButton onClick={() => {
                  setSelectedRow(params.row.id);
                  setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'delete', data: params.row }; });
                }}>
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

  const [selectedRow, setSelectedRow] = useState();

  const [contextMenu, setContextMenu] = useState(null);

  const [openDialog, setOpenDialog] = useState({
    open: false,
    type: '',
    data: {}
  });

  const handleContextMenu = (event) => {
    event.preventDefault();
    setSelectedRow(Number(event.currentTarget.getAttribute('data-id')));
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null,
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const openView = (array) => {
    array.map((row) => {
      if (row.id === selectedRow) {
        setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'view', data: row }; });
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
      <Dialog
        fullScreen={fullScreen}
        open={openDialog.open}
        className={`z-30 max-w-full`}
      >
        {
          openDialog.open
            ? (openDialog.type === "new" && <Create setOpenDialog={setOpenDialog} mobile={fullScreen} />)
            || (openDialog.type === "edit" && <Update setOpenDialog={setOpenDialog} data={openDialog.data} mobile={fullScreen} />)
            || (openDialog.type === "view" && <View setOpenDialog={setOpenDialog} data={openDialog.data} mobile={fullScreen} />)
            || (openDialog.type === "delete" && <Delete setOpenDialog={setOpenDialog} data={openDialog.data} mobile={fullScreen} />)
            : null
        }
      </Dialog>
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
            children: (<NewEntry className={`${!permissions.create && "hidden"}`} onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'new' }; })} />),
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
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        componentsProps={{
          root: {
            onContextMenu: (e) => {
              e.preventDefault();
              handleClose();
            },
          },
        }}
      >
        <MenuItem
          onClick={() => openView(tableArray)}>
          <ListItemIcon>
            <VisibilityIcon />
          </ListItemIcon>
          <ListItemText>
            View
          </ListItemText>
        </MenuItem>
        {(permissions.edit || permissions.delete) ?
          ['Edit', 'Delete'].map((option, index) => {
            return (
              <MenuItem
                key={index}
                onClick={option === "Edit" ?
                  () => openEdit(tableArray) :
                  () => openDelete(tableArray)}>
                <ListItemIcon>
                  {option === "Edit" ? <EditIcon /> : <DeleteIcon />}
                </ListItemIcon>
                <ListItemText>
                  {option}
                </ListItemText>
              </MenuItem>
            );
          }) : null}
      </Menu>
    </>
  );
};

export default memo(GeneralDataGrid);