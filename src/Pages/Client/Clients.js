import { Backdrop, Box, CircularProgress, Dialog, IconButton, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { memo, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { DataGridMenu, GeneralDataGrid } from '../../Components';

const Clients = () => {
  const { clients, user } = useSelector(state => {
    return {
      clients: state.clients,
      user: state.user
    };
  });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const navigate = useNavigate();
  const match = useMatch('/clients');

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
              navigate('./view/' + params.row.clientId);
              setOpenDialog(prev => { return { ...prev, open: true, type: 'view', data: params.row }; });
            }} className={`dark:text-white`}>
              <VisibilityIcon />
            </IconButton>
            {permissions.edit ? <IconButton onClick={() => {
              setSelectedRow(params.row.id);
              navigate('./edit/' + params.row.clientId);
              setOpenDialog(prev => { return { ...prev, open: true, type: 'edit', data: params.row }; });
            }} className={`dark:text-white`}>
              <EditIcon />
            </IconButton> : null}
            {permissions.delete ? <IconButton onClick={() => {
              setSelectedRow(params.row.id);
              navigate('./delete/' + params.row.clientId);
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
  });


  // useMemo(() => {
  //   setTable(prev => {
  //     return {
  //       ...prev,
  //       rows: JSON.parse(JSON.stringify(clients.clients).replace(/:null/gi, ":\"\""))
  //     };
  //   });
  // }, [clients.clients]);

  useMemo(() => {
    if (clients.clients) {
      setTable(prev => {
        return {
          ...prev,
          rows: JSON.parse(JSON.stringify(clients.clients).replace(/:null/gi, ":\"\""))
        };
      });
    }
  }, [clients.clients]);

  const [openDialog, setOpenDialog] = useState({
    open: false,
    type: '',
    data: {}
  });


  useMemo(() => {
    if (match && openDialog.open && !["new", "edit", "view", "delete"].includes(openDialog.type)) {
      setOpenDialog({
        ...openDialog,
        open: !openDialog.open
      });
    }
  }, [match, openDialog]);

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
        console.log(row);
        navigate('./view/' + row.clientId);
        setOpenDialog(prev => { return { ...prev, open: true, type: 'view', data: row }; });
      }
      return row;
    });
    handleClose();
  };

  const openEdit = (array) => {
    array.map((row) => {
      if (row.id === selectedRow) {
        navigate('./edit/' + row.clientId);
        setOpenDialog(prev => { return { ...prev, open: true, type: 'edit', data: row }; });
      }
      return row;
    });
    handleClose();
  };

  const openDelete = (array) => {
    array.map((row) => {
      if (row.id === selectedRow) {
        navigate('./delete/' + row.clientId);
        setOpenDialog(prev => { return { ...prev, open: true, type: 'delete', data: row }; });
      }
      return row;
    });
    handleClose();
  };


  return (
    <div className="w-full max-w-screen-lg mx-auto flex flex-col ">
      <Backdrop
        open={clients.status === "loading"}
        className={`z-40`}
        name="clientBackdrop"
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
      <Typography variant="h3" component="div" className={`py-5 text-psl-primary dark:text-psl-active-text`}>Clients</Typography>
      <GeneralDataGrid
        functions={{ setSelectedRow, handleContextMenu, setOpenDialog }}
        variables={{
          table, selectedRow, permissions,
          initialState: {
            columns: {
              columnVisibilityModel: {
                // Hides listed coloumns
                id: false,
                clientId: false,
                firstName: false,
                lastName: false,
                carers: false
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
          },
          settings: {
            type: 'client',
            button: 'New Client'
          }
        }}
      />
      <DataGridMenu
        functions={{ handleClose, openView, openEdit, openDelete }}
        variables={{ contextMenu, permissions, array: clients.clients }}
      />
    </div>
  );
};

export default memo(Clients);

