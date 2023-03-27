import { backendApi } from "../api/backendApi";
import { savePosts } from "./postSlice";

export const postApiSlice = backendApi.injectEndpoints({
  endpoints: builder => ({
    getPosts: builder.query({
      query: () => ({ url: '/posts', method: 'get' }),
      providesTags: (result, error, args) =>
        result
          ? [...result.data.data?.map(({ id }) => ({ type: 'post', id })),
          { type: 'post', id: "LIST" },
          ]
          : [{ type: 'post', id: "LIST" }],
      async onQueryStarted(undefiend, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(savePosts(data.data.data));
        }
        catch (err) {
          console.error(err);
        }
      }
    }),
    addPost: builder.mutation({
      query: (newPost) => ({ url: '/posts/create', method: 'post', data: newPost }),
      async onQueryStarted(newPost, { queryFulfilled }) {
        try {
          await queryFulfilled;
        }
        catch (err) {
          console.error(err);
        }
      },
      invalidatesTags: (result, error, args) =>
        result ? [{ type: "post", id: "LIST" }] : error ? console.error(error) : null
    }),
    updatePost: builder.mutation({
      query: (post) => ({ url: '/posts/update', method: 'put', data: post }),
      invalidatesTags: (result, error, args) =>
        result ? [{ type: "post", id: "LIST" }] : error ? console.error(error) : null
    })
  })
});

export const { useGetPostsQuery, useAddPostMutation, useUpdatePostMutation } = postApiSlice;