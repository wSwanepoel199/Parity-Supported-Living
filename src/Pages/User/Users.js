import { Box, Button, Typography, } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { lazy, memo, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { GeneralDataGrid } from "../../Components";

// import CreateUser from "./CreateUser/CreateUser";
const CreateUser = lazy(() => import('./CreateUser/CreateUser'));
// import UpdateUser from "./UpdateUser/UpdateUser";
const UpdateUser = lazy(() => import('./UpdateUser/UpdateUser'));
// import ViewUser from "./ViewUser/ViewUser";
const ViewUser = lazy(() => import('./ViewUser/ViewUser'));
//import ConfirmDialog from "./ConfirmDialog/ConfirmDialog";
const ConfirmDialog = lazy(() => import('./ConfirmDialog/ConfirmDialog'));

const Users = () => {
  // const adminState = useSelector(state => state.admin);
  // const userState = useSelector(state => state.user);
  const { admin, user } = useSelector(state => {
    return {
      admin: state.admin,
      user: state.user
    };
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

  return (
    <div className="w-full h-full max-w-screen-lg mx-auto flex flex-col ">
      <Typography variant="h3" component="div" className={`py-5`}>Users</Typography>
      <GeneralDataGrid
        intialTable={table}
        type="user"
        optionPermissions={{
          create: ["Admin"].includes(user.user.role),
          edit: ["Admin"].includes(user.user.role),
          view: user.status === 'loggedIn',
          delete: ["Admin"].includes(user.user.role),
        }}
        tableArray={admin.users}
        dialogOptions={{
          Create: (props) => <CreateUser {...props} />,
          Update: (props) => <UpdateUser {...props} />,
          View: (props) => <ViewUser {...props} />,
          Delete: (props) => <ConfirmDialog {...props} />,
        }}
        NewEntry={(props) => <Button startIcon={<AddIcon />} {...props}>
          New User
        </Button>
        }
        columns={{
          columnVisibilityModel: {
            // Hides listed coloumns
            id: false,
            userId: false,
            firstName: false,
            lastName: false,
            clients: false,
          },
        }}
        sorting={{
          sortModel: [
            {
              field: 'id',
              sort: 'desc',
            },
          ],
        }}
      />
    </div>
  );
};

export default memo(Users);