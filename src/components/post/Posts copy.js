import { Box, Button, Dialog, IconButton, Input, LinearProgress, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useGetPostsQuery } from "../../shared/redux/posts/postSlice";
import CreatePost from "./CreatePost";
import UpdatePost from "./UpdatePost";
import Toolbar from "../Toolbar";

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
      },
      {
        field: 'date',
        headerName: 'Date',
        valueFormatter: ({ value }) => `${value}`,
        renderCell: ({ value }) => value ? <p>{format(parseISO(value), 'dd/MM/yyyy')}</p> : null,
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'client',
        headerName: 'Client',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'carer',
        headerName: 'Carer',
        flex: 1,
        minWidth: 100,
        valueGetter: (params) => {
          return `${params.value.firstName} ${params.value?.lastName}`;
        },
        disableExport: true
      },
      {
        field: 'hours',
        headerName: 'Hours',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'kilos',
        headerName: 'Distance(KM)',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'notes',
        headerName: 'Notes',
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


  useEffect(() => {
    if (!mounted.current) {
      if (isSuccess && postState.posts?.length > table.rows.length) {
        const parsedPost = JSON.parse(JSON.stringify(postState.posts).replace(/:null/gi, ":\"\""));
        setTable(prev => {
          return {
            ...prev,
            rows: parsedPost
          };
        });
      }
      mounted.current = true;
    }
    if (mounted.current) {
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
        // onClose={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; })}
        >
          {
            openDialog.open
              ? (openDialog.type === "new" && <CreatePost setOpenDialog={setOpenDialog} />) || (openDialog.type === "edit" && <UpdatePost setOpenDialog={setOpenDialog} post={openDialog.data} />)
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
            onRowClick={(row) => { fullScreen && setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'edit', data: row.row }; }); }}
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
                csvOptions: { allColumns: true }
              }
            }}
            loading={isFetching || isLoading}
            className="bg-slate-300"
            initialState={{
              columns: {
                columnVisibilityModel: {
                  // Hides listed coloumns
                  carerId: false,
                  options: !fullScreen
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
        </Box>
      </> : null}
    </div>
  );
};

export default Posts;