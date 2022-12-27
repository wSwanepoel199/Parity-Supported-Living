import { createSlice } from "@reduxjs/toolkit";
import { backendApi } from "../../utils/api";
// import api from "../../utils/api";

const initialState = {
  status: 'asleep'
};

// const isPending = (action) => {
//   return action.type.endsWith('pending');
// };

// const isFulfilled = (action) => {
//   return action.type.endsWith('fulfilled');
// };

// const isRejected = (action) => {
//   return action.type.endsWith('rejected');
// };

export const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    savePosts: (state, action) => {
      return {
        ...state,
        posts: action.payload,
        status: "successful"
      };
    }
  },
  // extraReducers(builder) {
  //   console.log(builder);
  //   builder
  //     .addMatcher(isPending, () => {
  //       return {
  //         ...initialState,
  //         status: "fetching"
  //       };
  //     })
  //     .addMatcher(isFulfilled, (state, action) => {
  //       return {
  //         ...state,
  //         status: "fetched",
  //       };
  //     })
  //     .addMatcher(isRejected, (state, action) => {
  //       return {
  //         ...state,
  //         status: "failed",
  //         error: action.error.message
  //       };
  //     });
  // }
});


// export const getUser = createAsyncThunk('user/getUser', async (details) => {
//   const res = await api("post", '/auth/login', { data: details });
//   return res;
// });

// export const getPosts = createAsyncThunk('/posts/getAllPosts', async () => {
//   const res = await api('get', '/posts/');
//   return res;
// });

export const { savePosts } = postSlice.actions;

export default postSlice.reducer;

export const postApiSlice = backendApi.injectEndpoints({
  endpoints: builder => ({
    getPosts: builder.query({
      query: (posts) => ({ url: '/posts', method: 'get' }),
      async onQueryStarted(posts, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(savePosts(data.data));
        }
        catch (err) {
          console.error(err);
        }
      }
    })
  })
});

export const { useGetPostsQuery } = postApiSlice;