import { Backdrop, Box, Button, CircularProgress, Dialog, IconButton, LinearProgress, ListItemIcon, ListItemText, Menu, MenuItem, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { format, parseISO } from "date-fns";
import { DataGrid } from "@mui/x-data-grid";
import { memo, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useMatch, useNavigate } from "react-router-dom";


import Toolbar from "../../Components/DataGrid/Toolbar";


const Notes = () => {
  const { posts, user } = useSelector(state => {
    return {
      posts: state.posts,
      user: state.user,
    };
  });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const navigate = useNavigate();
  const match = useMatch('/notes');

  const permissions = {
    create: user.status === 'loggedIn',
    edit: ["Admin", "Coordinator"].includes(user.user.role),
    view: user.status === 'loggedIn',
    delete: ["Admin", "Coordinator"].includes(user.user.role),
  };

  const [table, setTable] = useState({
    columns: [
      {
        field: 'carerId',
        disableColumnMenu: true,
      },
      {
        field: 'clientId',
        disableColumnMenu: true,
      },
      {
        field: 'private',
        headerName: 'Private',
        disableColumnMenu: true,
        width: 65,
        sortable: false,
        renderCell: ({ value }) => {
          return (
            <Box className={`w-full flex justify-center items-center flex-row`}>
              {value ? <DoneIcon /> : <CloseIcon />}
            </Box>
          );
        },
        valueFormatter: ({ value }) => {
          return value;
        }
      },
      {
        field: 'date',
        headerName: 'Date',
        disableColumnMenu: true,
        valueFormatter: ({ value }) => `${value}`,
        renderCell: ({ value }) => value ? <p>{format(parseISO(value), 'dd/MM/yyyy')}</p> : null,
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'client',
        headerName: 'Client',
        disableColumnMenu: true,
        flex: 1,
        minWidth: 100,
        renderCell: ({ row }) => {
          if (row.clientId === "") {
            return <p className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}>
              <PriorityHighIcon fontSize="small" color="error" /> {row.clientName}</p>;
          } else if (row.clientName === "" && row.clientId !== "") {
            return <p className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}><PriorityHighIcon fontSize="small" color="warning" /> {`${row.client.firstName} ${row.client?.lastName}`}</p>;
          } else {
            return <p className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}>{`${row.clientName}`}</p>;
          }
        },
        disableExport: true
      },
      {
        field: 'clientName',
        disableColumnMenu: true,
      },
      {
        field: 'carer',
        headerName: 'Carer',
        disableColumnMenu: true,
        flex: 1,
        minWidth: 100,
        maxWidth: 150,
        renderCell: ({ row }) => {
          if (row.carerId === "") {
            return <p className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}>
              <PriorityHighIcon fontSize="small" color="error" /> {row.carerName}</p>;
          } else if (row.carerName === "" && row.carerId !== "") {
            return <p className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}><PriorityHighIcon fontSize="small" color="warning" /> {`${row.carer.firstName} ${row.carer?.lastName}`}</p>;
          } else {
            return <p className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`}>{`${row.carerName}`}</p>;
          }
        },
        disableExport: true
      },
      {
        field: 'carerName',
        disableColumnMenu: true,
      },
      {
        field: 'hours',
        headerName: 'Hours',
        disableColumnMenu: true,
        width: 60
      },
      {
        field: 'kilos',
        headerName: 'Distance(KM)',
        disableColumnMenu: true,
        flex: 1,
        minWidth: 110,
      },
      {
        field: 'notes',
        headerName: 'Notes',
        disableColumnMenu: true,
        flex: 3,
        minWidth: 200,
        renderCell: (value) => {
          const splitAtLineBreak = value.row.notes.split(/\r?\n/);
          const string = splitAtLineBreak.length >= 2 ? splitAtLineBreak[0] + "..." : splitAtLineBreak[0];
          return (
            <Box className={`text-ellipsis overflow-hidden whitespace-nowrap max-w-full`} >{string}</Box>
          );
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
              navigate('./view/' + params.row.postId);
              setOpenDialog(prev => { return { ...prev, open: true, type: 'view', data: params.row }; });
            }} className={`dark:text-white`}>
              <VisibilityIcon />
            </IconButton>
            {permissions.edit ? <IconButton onClick={() => {
              setSelectedRow(params.row.id);
              navigate('./edit/' + params.row.postId);
              setOpenDialog(prev => { return { ...prev, open: true, type: 'edit', data: params.row }; });
            }} className={`dark:text-white`}>
              <EditIcon />
            </IconButton> : null}
            {permissions.delete ? <IconButton onClick={() => {
              setSelectedRow(params.row.id);
              navigate('./delete/' + params.row.postId);
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
    pageSize: 10,
  });

  useMemo(() => {
    if (posts.posts) {
      setTable(prev => {
        return {
          ...prev,
          rows: JSON.parse(JSON.stringify(posts.posts).replace(/:null/gi, ":\"\""))
        };
      });
    }
  }, [posts.posts]);

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
        navigate('/notes/view/' + row.postId);
        setOpenDialog(prev => { return { ...prev, open: true, type: 'view', data: row }; });
      }
      return row;
    });
    handleClose();
  };

  const openEdit = (array) => {
    array.map((row) => {
      if (row.id === selectedRow) {
        navigate('/notes/edit/' + row.postId);
        setOpenDialog(prev => { return { ...prev, open: true, type: 'edit', data: row }; });
      }
      return row;
    });
    handleClose();
  };

  const openDelete = (array) => {
    array.map((row) => {
      if (row.id === selectedRow) {
        navigate('/notes/delete/' + row.postId);
        setOpenDialog(prev => { return { ...prev, open: true, type: 'delete', data: row }; });
      }
      return row;
    });
    handleClose();
  };


  return (
    <div className="w-full max-w-screen-lg mx-auto flex flex-col ">
      <Backdrop
        open={posts.status === "loading"}
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
      <Typography variant="h3" component="div" className={`py-5`}>Notes</Typography>
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
              navigate('/notes/new');
              setOpenDialog(prev => { return { ...prev, open: true, type: 'new' }; });
            }}>New Note</Button>),
            type: "post",
            csvOptions: { allColumns: true },
            clearSelect: setSelectedRow
          },
          row: {
            onContextMenu: fullScreen ? handleContextMenu : null,
            style: fullScreen && { cursor: 'context-menu' },
          },
        }}
        loading={posts.status === "loading"}
        className="bg-slate-300"
        initialState={{
          columns: {
            columnVisibilityModel: {
              // Hides listed coloumns
              carerId: false,
              clientId: false,
              clientName: false,
              carerName: false,
              // options: !fullScreen,
              private: ["Admin", "Coordinator"].includes(user.user.role) ? true : false
            },
          },
          sorting: {
            sortModel: [
              {
                field: 'date',
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
          onClick={() => openView(posts.posts)} >
          <ListItemIcon className={`dark:text-white`}>
            <VisibilityIcon />
          </ListItemIcon>
          <ListItemText className={`dark:text-white`}>
            View
          </ListItemText>
        </MenuItem>
        {permissions.edit ? <MenuItem
          onClick={() => openEdit(posts.posts)}
        >
          <ListItemIcon className={`dark:text-white`}>
            <EditIcon />
          </ListItemIcon>
          <ListItemText className={`dark:text-white`}>
            Edit
          </ListItemText>
        </MenuItem> : null}
        {permissions.delete ? <MenuItem
          onClick={() => openDelete(posts.posts)}
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

export default memo(Notes);

