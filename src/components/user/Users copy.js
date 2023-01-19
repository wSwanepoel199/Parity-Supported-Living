import { Box, Button, Dialog, IconButton, LinearProgress, Typography, useMediaQuery, useTheme } from "@mui/material";
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
  const { isFetching, isLoading, isSuccess } = useGetAllUsersQuery();

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
        field: 'id'
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
        field: 'userId'
      }
    ],
    rows: [],
    pageSize: 10
  });

  useEffect(() => {
    if (!mounted.current) {
      if (isSuccess && adminState.users?.length > table.rows.length) {
        const parsedPost = JSON.parse(JSON.stringify(adminState.users).replace(/:null/gi, ":\"\""));
        setTable(prev => {
          return {
            ...prev,
            rows: parsedPost
          };
        });
      }
      mounted.current = true;
    }
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
            flex: 1,
            minWidth: 100,
            maxWidth: 100,
            disableColumnMenu: true,
            disableColumnFilter: true,
            sortable: false,
            renderCell: (params) => (
              <>
                {userState.user.role === "Admin" ?
                  <IconButton onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'edit', data: params.row }; })}>
                    <EditIcon />
                  </IconButton> : null}
                <IconButton onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'delete', data: params.row }; })}>
                  <DeleteIcon />
                </IconButton>
              </>
            ),
            disableExport: true
          }]
      });
    }
    return () => {
      mounted.current = false;
    };
  }, [adminState.users, fullScreen, isSuccess, table, userState.user.role]);


  return (
    <div className="w-full h-full max-w-screen-lg mx-auto flex flex-col ">
      {mounted.current ? <>
        {/* (openDialog.type === "new" && <CreateUser setOpenDialog={setOpenDialog} />) || (openDialog.type === "edit" && <UpdatePost setOpenDialog={setOpenDialog} post={openDialog.data} />) */}
        <Typography variant="h3" component="div" className={`py-5`}>Users</Typography>
        <Dialog
          fullScreen={fullScreen}
          open={openDialog.open}
        // onClose={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; })}
        >
          {
            openDialog.open
              ? (openDialog.type === "new" && <CreateUser setOpenDialog={setOpenDialog} />) || (openDialog.type === "edit" && <UpdateUser setOpenDialog={setOpenDialog} user={openDialog.data} />) || (openDialog.type === "delete" && <ConfirmDialog setOpenDialog={setOpenDialog} user={openDialog.data} />)
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
            onRowClick={(row) => { fullScreen && setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'edit', data: row.row }; }); }}
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
                csvOptions: { allColumns: true }
              }
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
        </Box>
      </> : null}
    </div>
  );
};

export default Users;