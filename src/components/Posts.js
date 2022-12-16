import { DataGrid } from "@mui/x-data-grid";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getPosts } from "../shared/redux/posts/postSlice";

const Posts = () => {
  const dispatch = useDispatch();
  const postState = useSelector(state => state.posts);

  // useEffect(() => {
  //   dispatch(getPosts());
  // }, []);

  return (
    <div className="w-full h-full">
      {console.log(postState)}
      <h1>Posts</h1>
    </div>
  );
};

export default Posts;