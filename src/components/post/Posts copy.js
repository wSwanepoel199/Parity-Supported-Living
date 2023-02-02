import { Box, Button, Dialog, IconButton, Input, LinearProgress, Menu, MenuItem, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useGetPostsQuery } from "../../shared/redux/posts/postSlice";
import CreatePost from "./CreatePost";
import UpdatePost from "./UpdatePost";
import Toolbar from "../Toolbar";
import ViewPost from "./ViewPost";
import ConfirmDialog from "./ConfirmDialog";

const Posts = () => {
  const postState = useSelector(state => state.posts);
  const userState = useSelector(state => state.user);
  const mounted = useRef();
  const { isLoading, isFetching, isSuccess } = useGetPostsQuery();

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
        field: 'carerId',
        disableColumnMenu: true,
      },
      {
        field: 'private',
        disableColumnMenu: true,
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
      },
      {
        field: 'carer',
        headerName: 'Carer',
        disableColumnMenu: true,
        flex: 1,
        minWidth: 100,
        maxWidth: 150,
        valueGetter: (params) => {
          return `${params.value.firstName} ${params.value?.lastName}`;
        },
        disableExport: true
      },
      {
        field: 'hours',
        headerName: 'Hours',
        disableColumnMenu: true,
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'kilos',
        headerName: 'Distance(KM)',
        disableColumnMenu: true,
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'notes',
        headerName: 'Notes',
        disableColumnMenu: true,
        flex: 3,
        minWidth: 300,
        renderCell: (value) => {
          const splitAtLineBreak = value.row.notes.split(/\r?\n/);
          const string = splitAtLineBreak.length >= 1 ?
            splitAtLineBreak[0].toString().slice(0, 34) +
            ((value.row.notes.toString().length > 34 || splitAtLineBreak.length >= 2) ? "..." : " ")
            : splitAtLineBreak[0];
          return (
            <Input
              value={string}
              fullWidth
              disableUnderline
              multiline
              readOnly
            />
          );
        }
      },
    ],
    rows: [],
    pageSize: 10,
  });

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
    postState.posts.map((row) => {
      if (row.id === selectedRow) {
        setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'view', data: row }; });
      }
      return row;
    });
    handleClose();
  };

  const openEdit = () => {
    postState.posts.map((row) => {
      if (row.id === selectedRow) {
        setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'edit', data: row }; });
      }
      return row;
    });
    handleClose();
  };

  const openDelete = () => {
    postState.posts.map((row) => {
      if (row.id === selectedRow) {
        setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'delete', data: row }; });
      }
      return row;
    });
    handleClose();
  };

  useEffect(() => {
    let parsedPosts;
    if (!mounted.current) {
      if (postState.posts) parsedPosts = JSON.stringify(postState.posts).replace(/:null/gi, ":\"\"");
      mounted.current = true;
    }
    if (mounted.current) {
      if (isSuccess && parsedPosts && parsedPosts !== JSON.stringify(table.rows)) {
        const parsedPost = JSON.parse(parsedPosts);
        setTable(prev => {
          return {
            ...prev,
            rows: parsedPost
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
      } else if (!fullScreen && !table.columns.some(column => column['field'] === "options")) {
        setTable({
          ...table,
          columns: [
            ...table.columns,
            {
              field: 'options',
              headerName: "Options",
              flex: 2,
              minWidth: ["Admin", "Coordinator"].includes(userState.user.role) ? 150 : 70,
              maxWidth: ["Admin", "Coordinator"].includes(userState.user.role) ? 150 : 70,
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
                  {["Admin", "Coordinator"].includes(userState.user.role) ? <IconButton onClick={() => {
                    setSelectedRow(params.row.id);
                    setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'edit', data: params.row }; });
                  }}>
                    <EditIcon />
                  </IconButton> : null}
                  {["Admin", "Coordinator"].includes(userState.user.role) ? <IconButton onClick={() => {
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
    };
    return () => {
      mounted.current = false;
    };
  }, [mounted, postState.posts, isSuccess, fullScreen, userState.user.role, table]);

  return (
    <div className="w-full h-full max-w-screen-lg mx-auto flex flex-col ">
      {mounted.current ? <>
        <Typography variant="h3" component="div" className={`py-5`}>Notes</Typography>
        <Dialog
          fullScreen={fullScreen}
          open={openDialog.open}
          onClose={() => console.log("closew")}
        >
          {
            openDialog.open
              ? (openDialog.type === "new" && <CreatePost setOpenDialog={setOpenDialog} />)
              || (openDialog.type === "edit" && <UpdatePost setOpenDialog={setOpenDialog} post={openDialog.data} />)
              || (openDialog.type === "view" && <ViewPost setOpenDialog={setOpenDialog} post={openDialog.data} />)
              || (openDialog.type === "delete" && <ConfirmDialog setOpenDialog={setOpenDialog} post={openDialog.data} />)
              : null
          }
        </Dialog>
        <Box className={`flex `}>
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
            // onRowClick={(row) => { fullScreen && setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'edit', data: row.row }; }); }}
            selectionModel={selectedRow}
            // onRowClick={() => setSelectedRow([])}
            components={{
              Toolbar: Toolbar,
              LoadingOverlay: LinearProgress,
            }}
            componentsProps={{
              toolbar: {
                children: (
                  <Box>
                    <Button startIcon={<AddIcon />} onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'new' }; })}>
                      New Note
                    </Button>
                  </Box>),
                type: 'post',
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
                  carerId: false,
                  options: !fullScreen,
                  private: false
                },
              },
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
      </> : null}
    </div>
  );
};

export default Posts;