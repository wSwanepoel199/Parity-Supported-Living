import { Box, LinearProgress } from "@mui/material";
import { DataGrid, GridToolbar, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetPostsQuery } from "../shared/redux/posts/postSlice";

const Toolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

const Posts = () => {
  const postState = useSelector(state => state.posts);
  const { isUninitialized, isLoading, isFetching, isSuccess } = useGetPostsQuery();

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
        minWidth: 100,
      }
    ],
    rows: [],
    pageSize: 10,
  });

  useEffect(() => {
    if (isSuccess) {
      setTable(prev => {
        return {
          ...prev,
          rows: postState.posts
        };
      });
    }
  }, [postState.posts, isSuccess]);

  return (
    <div className="w-full h-full px-10">
      <h1>Posts</h1>
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
            getRowId={(row) => row.postId}
            onRowClick={(row) => console.log("clicked", row)}
            components={{
              Toolbar: Toolbar,
              LoadingOverlay: LinearProgress,
            }}
            loading={isFetching}
            className="bg-slate-300"
          />
        </div>
      </Box>
    </div>
  );
};

export default Posts;