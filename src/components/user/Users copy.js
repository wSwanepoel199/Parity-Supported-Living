import { Box, Button, Dialog, IconButton, LinearProgress, Menu, MenuItem, Typography, useMediaQuery, useTheme } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useGetAllUsersQuery } from "../../shared/redux/admin/adminSlice";
import Toolbar from "../Toolbar";
import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser";
import ConfirmDialog from "./ConfirmDialog";

const Users = () => {
  const adminState = useSelector(state => state.admin);
  const userState = useSelector(state => state.user);
  const mounted = useRef();
  const { isFetching, isLoading, isSuccess } = useGetAllUsersQuery(undefined, { refetchOnMountOrArgChange: true });

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
        field: 'role',
        headerName: 'Role',
        flex: 1,
        minWidth: 100,
        maxWidth: 100
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
        minWidth: 160,
        valueGetter: ({ row }) => { return `${row.firstName} ${row?.lastName}`; },
        disableExport: true
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'userId',
        flex: 1,
        minWidth: 100,
      }
    ],
    rows: [],
    pageSize: 10
  });

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    }
    if (mounted.current) {
      if (isSuccess && adminState.users && adminState.users?.length !== table.rows.length) {
        const parsedUsers = JSON.parse(JSON.stringify(adminState.users).replace(/:null/gi, ":\"\""));
        setTable(prev => {
          return {
            ...prev,
            rows: parsedUsers
          };
        });
      }
      if (fullScreen && table.columns.some(column => column['field'] === "options")) {
        setTable(prev => {
          return {
            ...prev,
            columns: prev.columns.slice(0, -1)
          };
        });
      } else if (!fullScreen && !table.columns.some(column => column['field'] === "options") && ["Admin"].includes(userState.user.role)) {
        setTable({
          ...table,
          columns: [
            ...table.columns,
            {
              field: 'options',
              headerName: "Options",
              flex: 1,
              minWidth: 100,
              maxWidth: 100,
              disableColumnMenu: true,
              disableColumnFilter: true,
              sortable: false,
              renderCell: (params) => (
                <Box className={`flex justify-center`}>
                  {userState.user.role === "Admin" ? <IconButton onClick={() => {
                    setSelectedRow(params.row.id);
                    setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'edit', data: params.row }; });
                  }}>
                    <EditIcon />
                  </IconButton> : null}
                  {userState.user.role === "Admin" ? <IconButton onClick={() => {
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
    }
    return () => {
      mounted.current = false;
    };
  }, [mounted, adminState.users, fullScreen, isSuccess, table, userState.user.role]);

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
              onContextMenu: handleContextMenu,
              style: { cursor: 'context-menu' },
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