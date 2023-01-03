import { createSlice } from "@reduxjs/toolkit";
import { backendApi } from "../api/backendApi";
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
      query: () => ({ url: '/posts', method: 'get' }),
      providesTags: (result, error, args) =>
        result
          ? [...result.data.map(({ id }) => ({ type: 'Post', id })),
          { type: 'Post', id: "LIST" },
          ]
          : [{ type: 'Post', id: "LIST" }],
      async onQueryStarted(undefiend, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(savePosts(data.data));
        }
        catch (err) {
          console.error(err);
        }
      }
    }),
    addPost: builder.mutation({
      query: (post) => ({ url: '/posts/create', method: 'post', data: post }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    updatePost: builder.mutation({
      query: (post) => ({ url: '/posts/update', method: 'put', data: post }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    })
  })
});

export const { useGetPostsQuery, useAddPostMutation, useUpdatePostMutation } = postApiSlice;