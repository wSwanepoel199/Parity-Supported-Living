import { Box, Button, Dialog, LinearProgress, Typography, useMediaQuery, useTheme } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetAllUsersQuery } from "../../shared/redux/admin/adminSlice";
import Toolbar from "../Toolbar";
import CreateUser from "./CreateUser";

const Users = () => {
  const adminState = useSelector(state => state.admin);
  const { data, isFetching, isLoading, isSuccess } = useGetAllUsersQuery();

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
    ],
    rows: [],
    pageSize: 10
  });

  useEffect(() => {
    if (isSuccess && adminState.users) {
      setTable(prev => {
        return {
          ...prev,
          rows: adminState.users
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
            ? openDialog.type === "new" && <CreateUser setOpenDialog={setOpenDialog} />
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
          getRowId={(row) => row.userId}
          onRowClick={(row) => setOpenDialog(prev => { console.log(row); return { ...prev, open: !prev.open, type: 'edit', data: row.row }; })}
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