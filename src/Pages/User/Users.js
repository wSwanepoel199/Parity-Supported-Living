import { Backdrop, Box, Button, CircularProgress, Dialog, IconButton, LinearProgress, ListItemIcon, ListItemText, Menu, MenuItem, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DataGrid } from "@mui/x-data-grid";
import { memo, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useMatch, useNavigate } from "react-router-dom";


import Toolbar from "../../Components/DataGrid/Toolbar";

const Users = () => {
  const { admin, user } = useSelector(state => {
    return {
      admin: state.admin,
      user: state.user
    };
  });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const navigate = useNavigate();
  const match = useMatch('/users');

  const permissions = {
    create: ["Admin"].includes(user.user.role),
    edit: ["Admin"].includes(user.user.role),
    view: user.status === 'loggedIn',
    delete: ["Admin"].includes(user.user.role),
  };

  const [table, setTable] = useState({
    columns: [
      {
        field: 'id',
        disableExport: true
      },
      {
        field: 'userId',
      },
      {
        field: 'role',
        headerName: 'Role',
        width: 95,
      },
      {
        field: 'firstName',
      },
      {
        field: 'lastName',
      },
      {
        field: 'name',
        headerName: 'Name',
        flex: 1,
        minWidth: 100,
        valueGetter: ({ row }) => { return `${row.firstName} ${row?.lastName}`; },
        disableExport: true
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        minWidth: 100,
        renderCell: ({ value }) => <p className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}>{value}</p>,
      },
      {
        field: 'clientsName',
        headerName: 'Clients',
        disableExport: true,
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
          const clients = params.row.clients.map((clients) => `${clients.firstName} ${clients?.lastName}`).join(', ');
          return <Box className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}>
            {clients}
          </Box>;
        },
      },
      {
        field: 'clients',
        disableColumnMenu: true,
        valueFormatter: (params) => {
          return params.value.map(client => client.clientId).join(", ");
        }
      },
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
              navigate('./view/' + params.row.userId);
              setOpenDialog(prev => { return { ...prev, open: true, type: 'view', data: params.row }; });
            }} className={`dark:text-white`}>
              <VisibilityIcon />
            </IconButton>
            {permissions.edit ? <IconButton onClick={() => {
              setSelectedRow(params.row.id);
              navigate('./edit/' + params.row.userId);
              setOpenDialog(prev => { return { ...prev, open: true, type: 'edit', data: params.row }; });
            }} className={`dark:text-white`}>
              <EditIcon />
            </IconButton> : null}
            {permissions.delete ? <IconButton onClick={() => {
              setSelectedRow(params.row.id);
              navigate('./delete/' + params.row.userId);
              setOpenDialog(prev => { return { ...prev, open: true, type: 'delete', data: params.row }; });
            }} className={`dark:text-white`}>
              <DeleteIcon />
            </IconButton> : null}
          </Box>
        ),
        disableExport: true
      }
    ],
    rows: [],
    pageSize: 10
  });

  useMemo(() => {
    if (admin.users) {
      setTable(prev => {
        return {
          ...prev,
          rows: JSON.parse(JSON.stringify(admin.users).replace(/:null/gi, ":\"\""))
        };
      });
    }
  }, [admin.users]);

  const [openDialog, setOpenDialog] = useState({
    open: false,
    type: '',
    data: {}
  });


  useMemo(() => {
    if (match && openDialog.open) {
      setOpenDialog(prev => {
        return {
          ...prev,
          open: false
        };
      });
    }
  }, [match]);

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
        navigate('./view/' + row.userId);
        setOpenDialog(prev => { return { ...prev, open: true, type: 'view', data: row }; });
      }
      return row;
    });
    handleClose();
  };

  const openEdit = (array) => {
    array.map((row) => {
      if (row.id === selectedRow) {
        navigate('./edit/' + row.userId);
        setOpenDialog(prev => { return { ...prev, open: true, type: 'edit', data: row }; });
      }
      return row;
    });
    handleClose();
  };

  const openDelete = (array) => {
    array.map((row) => {
      if (row.id === selectedRow) {
        navigate('./delete/' + row.userId);
        setOpenDialog(prev => { return { ...prev, open: true, type: 'delete', data: row }; });
      }
      return row;
    });
    handleClose();
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto flex flex-col ">
      <Backdrop
        open={admin.status === "loading"}
        className={`z-40`}
      >
        <CircularProgress />
      </Backdrop>
      <Dialog
        fullScreen={fullScreen}
        open={openDialog.open}
        className={`z-30 max-w-full`}
      >
        <Outlet context={[openDialog, setOpenDialog, fullScreen]} />
      </Dialog>
      <Typography variant="h3" component="div" className={`py-5`}>Users</Typography>
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
            children: (<Button startIcon={<AddIcon />} className={`${!permissions.create && "hidden"}`} onClick={() => {
              navigate('./new');
              setOpenDialog(prev => { return { ...prev, open: true, type: 'new' }; });
            }}>New User</Button>),
            type: "user",
            csvOptions: { allColumns: true },
            clearSelect: setSelectedRow
          },
          row: {
            onContextMenu: fullScreen ? handleContextMenu : null,
            style: fullScreen && { cursor: 'context-menu' },
          },
        }}
        loading={admin.status === "loading"}
        className="bg-slate-300"
        initialState={{
          columns: {
            columnVisibilityModel: {
              // Hides listed coloumns
              id: false,
              userId: false,
              firstName: false,
              lastName: false,
              clients: false,
            },
          },
          sorting: {
            sortModel: [
              {
                field: 'id',
                sort: 'desc',
              },
            ],
          }
        }}
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
        MenuListProps={{
          className: 'dark:bg-slate-800'
        }}
      >
        <MenuItem
          onClick={() => openView(admin.users)} >
          <ListItemIcon className={`dark:text-white`}>
            <VisibilityIcon />
          </ListItemIcon>
          <ListItemText className={`dark:text-white`}>
            View
          </ListItemText>
        </MenuItem>
        {permissions.edit ? <MenuItem
          onClick={() => openEdit(admin.users)}
        >
          <ListItemIcon className={`dark:text-white`}>
            <EditIcon />
          </ListItemIcon>
          <ListItemText className={`dark:text-white`}>
            Edit
          </ListItemText>
        </MenuItem> : null}
        {permissions.delete ? <MenuItem
          onClick={() => openDelete(admin.users)}
        >
          <ListItemIcon className={`dark:text-white`}>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText className={`dark:text-white`}>
            Delete
          </ListItemText>
        </MenuItem> : null}
      </Menu>
    </div>
  );
};

export default memo(Users);