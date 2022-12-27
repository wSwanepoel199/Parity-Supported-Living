import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetPostsQuery } from "../shared/redux/posts/postSlice";
// import { getPosts } from "../shared/redux/posts/postSlice";

const RenderDate = (props) => {
  return (
    <>
      {/* {console.log(props)} */}
      {format(parseISO(props.value), 'dd/MM/yyyy')}
    </>
  );
};

const Posts = () => {
  const postState = useSelector(state => state.posts);
  useGetPostsQuery();

  const [table, setTable] = useState({
    columns: [
      {
        field: 'date',
        headerName: 'Date',
        renderCell: RenderDate,
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
        field: 'hours',
        headerName: 'Hours',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'kilos',
        headerName: 'Distance',
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
  });

  useEffect(() => {
    setTable(prev => {
      return {
        ...prev,
        rows: postState.posts
      };
    });
  }, [postState]);

  return (
    <div className="w-full h-full">
      {console.log(postState, table)}
      <h1>Posts</h1>
      <Box className="flex">
        <div className="grow">
          <DataGrid
            rows={table.rows}
            columns={table.columns}
            autoHeight
          />
        </div>
      </Box>
    </div>
  );
};

export default Posts;