import { backendApi } from "../api/backendApi";
import { saveUsers } from "./adminSlice";

export const adminApiSlice = backendApi.injectEndpoints({
  endpoints: builder => ({
    getAllUsers: builder.query({
      query: (users) => ({ url: '/auth/', method: 'get' }),
      providesTags: (result, error, args) =>
        result
          ? [...result.data.data?.map(({ id }) => ({ type: 'user', id })),
          { type: 'user', id: "LIST" },
          ]
          : [{ type: 'user', id: "LIST" }],
      async onQueryStarted(users, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(saveUsers(data.data.data));
        }
        catch (err) {
          console.error(err);
        }
      }
    }),
    getUser: builder.query({
      query: (userId) => ({ url: '/auth/get/' + userId, method: "get" }),
      transformResponse: (response, meta, arg) => response.data.data,
      async onQueryStarted(userId, { queryFulfilled }) {
        console.log(userId);
        try {
          const { data } = await queryFulfilled;
          return data;
        }
        catch (err) {
          console.error(err);
        }
      }
    }),
    deleteTargetUser: builder.mutation({
      query: (user) => ({ url: '/auth/delete/' + user, method: 'get' }),
      invalidatesTags: (result, error, args) =>
        result ? [{ type: "user", id: "LIST" }] : error ? console.error(error) : null
    }),
    deleteTargetPost: builder.mutation({
      query: (postId) => ({ url: '/posts/delete/' + postId, method: 'get' }),
      invalidatesTags: (result, error, args) =>
        result ? [{ type: "post", id: "LIST" }] : error ? console.error(error) : null
    })
  })
});

export const { useGetAllUsersQuery, useGetUserQuery, useDeleteTargetUserMutation, useDeleteTargetPostMutation } = adminApiSlice;