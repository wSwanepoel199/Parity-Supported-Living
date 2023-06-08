import { Box, Button, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { memo, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { GeneralDataGrid } from "../../Components";
import CreateClient from "./CreateClient/CreateClient";
import UpdateClient from "./UpdateClient/UpdateClient";
import ViewClient from "./ViewClient/ViewClient";
import ConfirmDialog from "./ConfirmDialog/ConfirmDialog";



const Clients = () => {
  const { clients, user } = useSelector(state => {
    return {
      clients: state.clients,
      user: state.user
    };
  });
  // const userState = useSelector(state => state.user);

  const [table, setTable] = useState({
    columns: [
      {
        field: 'id',
        disableExport: true
      },
      {
        field: 'clientId',
        flex: 1,
        minWidth: 100,
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
        renderCell: ({ value }) => <Box className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}>{value}</Box>,
        disableExport: true
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        minWidth: 100,
        renderCell: ({ value }) => <Box className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}>{value}</Box>
      },
      {
        field: 'phoneNumber',
        headerName: 'Number',
        flex: 1,
        minWidth: 100,
        renderCell: ({ value }) => <Box className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}>{value}</Box>
      },
      {
        field: 'address',
        headerName: 'Address',
        flex: 1,
        minWidth: 100,
        renderCell: ({ value }) => <Box className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}>{value}</Box>
      },
      {
        field: 'carersName',
        headerName: 'Carers',
        disableExport: true,
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
          const carers = params.row.carers.map((carer) => `${carer.firstName}`).join(', ');
          return <Box className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}>
            {carers}
          </Box>;
        },
      },
      {
        field: 'notes',
        headerName: 'Notes',
        disableColumnMenu: true,
        flex: 2,
        minWidth: 100,
        renderCell: (value) => {
          const splitAtLineBreak = value.row.notes.split(/\r?\n/);
          const string = splitAtLineBreak.length >= 2 ? splitAtLineBreak[0] + "..." : splitAtLineBreak[0];
          return (
            <Box className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`} >{string}</Box>
          );
        }
      },
      {
        field: 'carers',
        disableColumnMenu: true,
        valueFormatter: (params) => {
          return params.value.map(carer => carer.userId).join(', ');
        }
      },
    ],
    rows: [],
    pageSize: 10
  });


  useMemo(() => {
    setTable(prev => {
      return {
        ...prev,
        rows: JSON.parse(JSON.stringify(clients.clients).replace(/:null/gi, ":\"\""))
      };
    });
  }, [clients.clients]);

  // useEffect(() => {
  //   if (clients.clients) {
  //     setTable(prev => {
  //       return {
  //         ...prev,
  //         rows: JSON.parse(JSON.stringify(clients.clients).replace(/:null/gi, ":\"\""))
  //       };
  //     });
  //   }
  // }, [clients.clients]);


  return (
    <div className="w-full max-w-screen-lg mx-auto flex flex-col ">
      <Typography variant="h3" component="div" className={`py-5`}>Clients</Typography>
      <GeneralDataGrid
        intialTable={table}
        type="client"
        optionPermissions={{
          create: ["Admin"].includes(user.user.role),
          edit: ["Admin"].includes(user.user.role),
          view: user.status === 'loggedIn',
          delete: ["Admin"].includes(user.user.role),
        }}
        tableArray={clients.clients}
        dialogOptions={{
          Create: (props) => <CreateClient {...props} />,
          Update: (props) => <UpdateClient {...props} />,
          View: (props) => <ViewClient {...props} />,
          Delete: (props) => <ConfirmDialog {...props} />,
        }}
        NewEntry={(props) => <Button startIcon={<AddIcon />} {...props}>
          New Client
        </Button>
        }
        columns={{
          columnVisibilityModel: {
            // Hides listed coloumns
            id: false,
            clientId: false,
            firstName: false,
            lastName: false,
            carers: false
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

export default Clients;