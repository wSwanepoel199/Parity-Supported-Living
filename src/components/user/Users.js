import { Box, Button, Dialog, IconButton, LinearProgress, Menu, MenuItem, Typography, useMediaQuery, useTheme } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DataGrid } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useGetAllUsersQuery } from "../../shared/redux/admin/adminApiSlice";
import Toolbar from "../Toolbar";
import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser";
import ConfirmDialog from "./ConfirmDialog";

const Users = () => {
  const adminState = useSelector(state => state.admin);
  const userState = useSelector(state => state.user);
  const { isFetching, isLoading, } = useGetAllUsersQuery(undefined, { refetchOnMountOrArgChange: true });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [openDialog, setOpenDialog] = useState({
    open: false,
    type: '',
    data: {}
  });

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
      },
      {
        field: 'clientsName',
        headerName: 'Clients',
        disableExport: true,
        flex: 2,
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
          return params.value.map(client => client.clientId);
        }
      },
    ],
    rows: [],
    pageSize: 10
  });

  useMemo(() => {
    if (adminState.users) {
      setTable(prev => {
        return {
          ...prev,
          rows: JSON.parse(JSON.stringify(adminState.users).replace(/:null/gi, ":\"\""))
        };
      });
    }
  }, [adminState.users]);

  useMemo(() => {
    if (fullScreen && table.columns.some(column => column['field'] === "options")) {
      setTable(prev => {
        return {
          ...prev,
          columns: prev.columns.slice(0, -1)
        };
      });
    } else if (!fullScreen && !table.columns.some(column => column['field'] === "options")) {
      setTable({
        ...table,
        columns: [
          ...table.columns,
          {
            field: 'options',
            headerName: "Options",
            width: ["Admin", "Coordinator"].includes(userState.user.role) ? 140 : 70,
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
                {["Admin"].includes(userState.user.role) ? <IconButton onClick={() => {
                  setSelectedRow(params.row.id);
                  setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'edit', data: params.row }; });
                }}>
                  <EditIcon />
                </IconButton> : null}
                {["Admin"].includes(userState.user.role) ? <IconButton onClick={() => {
                  setSelectedRow(params.row.id);
                  setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'delete', data: params.row }; });
                }}>
                  <DeleteIcon />
                </IconButton> : null}
              </Box>
            ),
            disableExport: true
          }]
      });
    }
  }, [fullScreen, table, userState.user.role]);

  const [selectedRow, setSelectedRow] = useState();

  const [contextMenu, setContextMenu] = useState(null);

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

  const openEdit = () => {
    adminState.users.map((row) => {
      if (row.id === selectedRow) {
        setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'edit', data: row }; });
      }
      return row;
    });
    handleClose();
  };

  const openDelete = () => {
    adminState.users.map((row) => {
      if (row.id === selectedRow) {
        setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'delete', data: row }; });
      }
      return row;
    });
    handleClose();
  };

  return (
    <div className="w-full h-full max-w-screen-lg mx-auto flex flex-col ">
      <Typography variant="h3" component="div" className={`py-5`}>Users</Typography>
      <Dialog
        fullScreen={fullScreen}
        open={openDialog.open}
        className={`z-30 max-w-full`}
      >
        {
          openDialog.open
            ? (openDialog.type === "new" && <CreateUser setOpenDialog={setOpenDialog} />)
            || (openDialog.type === "edit" && <UpdateUser setOpenDialog={setOpenDialog} user={openDialog.data} />)
            || (openDialog.type === "delete" && <ConfirmDialog setOpenDialog={setOpenDialog} user={openDialog.data} />)
            : null
        }
      </Dialog>
      <Box className={`flex`}>
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
              children: (
                <Box>
                  {userState.user.role === "Admin" ?
                    <Button startIcon={<AddIcon />} onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'new' }; })}>
                      New User
                    </Button> : null}
                </Box>
              ),
              type: 'user',
              csvOptions: { allColumns: true },
              clearSelect: setSelectedRow
            },
            row: {
              onContextMenu: fullScreen ? handleContextMenu : null,
              style: fullScreen && { cursor: 'context-menu' },
            },
          }}
          loading={isFetching || isLoading}
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
            },
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
        >
          {userState.user.role === "Admin" ?
            ['Edit', 'Delete'].map((option, index) => {
              return (
                <MenuItem key={index} onClick={option === "Edit" ? openEdit : openDelete}>{option}</MenuItem>
              );
            }) : null}
        </Menu>
      </Box>
    </div>
  );
};

export default Users;