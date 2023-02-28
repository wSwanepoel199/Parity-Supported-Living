import { Box, Button, Dialog, IconButton, LinearProgress, Menu, MenuItem, Typography, useMediaQuery, useTheme } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DataGrid } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useGetAllClientsQuery } from "../../shared/redux/client/clientApiSlice";
import Toolbar from "../Toolbar";
import CreateClient from "./CreateClient";
import UpdateClient from "./UpdateClient";
import ConfirmDialog from "./ConfirmDialog";
import ViewClient from "./ViewClient";


const Clients = () => {
  const clientState = useSelector(state => state.clients);
  const userState = useSelector(state => state.user);
  const { isFetching, isLoading, } = useGetAllClientsQuery(undefined, { refetchOnMountOrArgChange: true });

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
        disableExport: true
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'phoneNumber',
        headerName: 'Number',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'address',
        headerName: 'Address',
        flex: 1,
        minWidth: 100,
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
    if (clientState.clients) {
      setTable(prev => {
        return {
          ...prev,
          rows: JSON.parse(JSON.stringify(clientState.clients).replace(/:null/gi, ":\"\""))
        };
      });
    }
  }, [clientState.clients]);

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
            width: ["Admin", "Coordinator"].includes(userState.user.role) ? 130 : 70,
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

  const openView = () => {
    clientState.clients.map((row) => {
      if (row.id === selectedRow) {
        setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'view', data: row }; });
      }
      return row;
    });
    handleClose();
  };

  const openEdit = () => {
    clientState.clients.map((row) => {
      if (row.id === selectedRow) {
        setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'edit', data: row }; });
      }
      return row;
    });
    handleClose();
  };

  const openDelete = () => {
    clientState.clients.map((row) => {
      if (row.id === selectedRow) {
        setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'delete', data: row }; });
      }
      return row;
    });
    handleClose();
  };

  return (
    <div className="w-full h-full max-w-screen-lg mx-auto flex flex-col ">
      <Typography variant="h3" component="div" className={`py-5`}>Clients</Typography>
      <Dialog
        fullScreen={fullScreen}
        open={openDialog.open}
        className={`z-30 max-w-full`}
      >
        {
          openDialog.open
            ? (openDialog.type === "new" && <CreateClient setOpenDialog={setOpenDialog} />)
            || (openDialog.type === "edit" && <UpdateClient setOpenDialog={setOpenDialog} client={openDialog.data} />)
            || (openDialog.type === "view" && <ViewClient setOpenDialog={setOpenDialog} client={openDialog.data} />)
            || (openDialog.type === "delete" && <ConfirmDialog setOpenDialog={setOpenDialog} client={openDialog.data} />)
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
                      New Client
                    </Button> : null}
                </Box>
              ),
              type: 'client',
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
          <MenuItem onClick={openView}>View</MenuItem>
          {["Admin", "Coordinator"].includes(userState.user.role) ?
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

export default Clients;