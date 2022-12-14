import { Box, Button, Dialog, IconButton, LinearProgress, Typography, useMediaQuery, useTheme } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetAllUsersQuery } from "../../shared/redux/admin/adminSlice";
import Toolbar from "../Toolbar";
import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser";
import ConfirmDialog from "./ConfirmDialog";

const Users = () => {
  const adminState = useSelector(state => state.admin);
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
        field: 'name',
        headerName: 'Name',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'role',
        headerName: 'Role',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'options',
        headerName: "Options",
        flex: 0,
        minWidth: 100,
        disableColumnMenu: true,
        disableColumnFilter: true,
        sortable: false,
        renderCell: (params) => (
          <>
            <IconButton onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'edit', data: params.row }; })}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'delete', data: params.row }; })}>
              <DeleteIcon />
            </IconButton>
          </>
        )
      }
    ],
    rows: [],
    pageSize: 10
  });

  useEffect(() => {
    if (isSuccess && adminState.users) {
      const parsedUsers = JSON.parse(JSON.stringify(adminState.users).replace(/:null/gi, ":\"\""));
      setTable(prev => {
        return {
          ...prev,
          rows: parsedUsers
        };
      });
    }
  }, [adminState.users, isSuccess]);

  return (
    <div className="w-full h-full max-w-screen-lg mx-auto flex flex-col ">
      {/* (openDialog.type === "new" && <CreateUser setOpenDialog={setOpenDialog} />) || (openDialog.type === "edit" && <UpdatePost setOpenDialog={setOpenDialog} post={openDialog.data} />) */}
      <Typography variant="h3" component="div" className={`py-5`}>Users</Typography>
      <Dialog
        fullScreen={fullScreen}
        open={openDialog.open}
        onClose={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; })}
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
          components={{
            Toolbar: Toolbar,
            LoadingOverlay: LinearProgress,
          }}
          componentsProps={{
            toolbar: {
              children: (
                <Box>
                  <Button startIcon={<AddIcon />} onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'new' }; })}>
                    New User
                  </Button>
                </Box>
              )
            }
          }}
          loading={isFetching || isLoading}
          className="bg-slate-300"
          initialState={{
            sorting: {
              sortModel: [
                {
                  field: 'date',
                  sort: 'desc',
                },
              ],
            },
          }}
        />
      </Box>
    </div>
  );
};

export default Users;