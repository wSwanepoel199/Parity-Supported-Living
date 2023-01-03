import { Box, Button, Dialog, Input, LinearProgress, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, useGridApiContext, useGridApiRef } from "@mui/x-data-grid";
import AddIcon from '@mui/icons-material/Add';
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetPostsQuery } from "../shared/redux/posts/postSlice";
import CreatePost from "./CreatePost";
import UpdatePost from "./UpdatePost";

const Toolbar = ({ setOpenDialog }) => {
  return (
    <GridToolbarContainer className="justify-between">
      <Box>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </Box>
      <Box>
        <Button startIcon={<AddIcon />} onClick={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: 'new' }; })}>
          New Post
        </Button>
      </Box>
    </GridToolbarContainer>
  );
};

const Posts = () => {
  const postState = useSelector(state => state.posts);
  const { isLoading, isFetching, isSuccess } = useGetPostsQuery();

  const apiRef = useGridApiRef();

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
        field: 'date',
        headerName: 'Date',
        valueFormatter: (props) => {
          return format(parseISO(props.value), 'dd/MM/yyyy');
        },
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'client',
        headerName: 'Client Name',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'carer',
        headerName: 'Carer',
        flex: 1,
        minWidth: 100,
        valueGetter: (props) => {
          return props.value.name;
        }
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
      }
    ],
    rows: [],
    pageSize: 10,
  });

  useEffect(() => {
    if (isSuccess && postState.posts) {
      setTable(prev => {
        return {
          ...prev,
          rows: postState.posts
        };
      });
    }
  }, [postState.posts, isSuccess]);

  return (
    <div className="w-full h-full px-5">
      <h1>Posts</h1>
      <Dialog
        fullScreen={fullScreen}
        open={openDialog.open}
        onClose={() => setOpenDialog(prev => { return { ...prev, open: !prev.open, type: '', data: {} }; })}
      >
        {
          openDialog.open
            ? (openDialog.type === "new" && <CreatePost setOpenDialog={setOpenDialog} />) || (openDialog.type === "edit" && <UpdatePost setOpenDialog={setOpenDialog} post={openDialog.data} />)
            : null
        }
      </Dialog>
      <Box className="flex">
        <div className="grow">
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
            getRowId={(row) => row.postId}
            onRowClick={(row) => setOpenDialog(prev => { console.log(row); return { ...prev, open: !prev.open, type: 'edit', data: row.row }; })}
            components={{
              Toolbar: Toolbar,
              LoadingOverlay: LinearProgress,
            }}
            componentsProps={{
              toolbar: { setOpenDialog: setOpenDialog }
            }}
            loading={isFetching || isLoading}
            className="bg-slate-300"
          />
        </div>
      </Box>
    </div>
  );
};

export default Posts;