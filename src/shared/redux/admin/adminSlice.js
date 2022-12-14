import { createSlice } from "@reduxjs/toolkit";
import { } from "../../utils/authToken";
import { backendApi } from "../api/backendApi";

const initialState = {
  users: undefined,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    saveUsers: (state, action) => {
      return {
        ...state,
        users: action.payload
      };
    }
  },
});

export const { saveUsers } = adminSlice.actions;

export default adminSlice.reducer;

export const adminApiSlice = backendApi.injectEndpoints({
  endpoints: builder => ({
    getAllUsers: builder.query({
      query: (users) => ({ url: '/auth/', method: 'get' }),
      providesTags: (result, error, args) =>
        result
          ? [...result.data.data.map(({ id }) => ({ type: 'User', id })),
          { type: 'User', id: "LIST" },
          ]
          : [{ type: 'User', id: "LIST" }],
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
    deleteTargetUser: builder.mutation({
      query: (user) => ({ url: '/auth/delete', method: 'post', data: user }),
      invalidatesTags: (result, error, args) =>
        result ? [{ type: "User", id: "LIST" }] : error ? console.error(error) : null
    }),
    deleteTargetPost: builder.mutation({
      query: (target) => ({ url: '/posts/delete', method: 'post', data: target }),
      invalidatesTags: (result, error, args) =>
        result ? [{ type: "Post", id: "LIST" }] : error ? console.error(error) : null
    })
  })
});

export const { useGetAllUsersQuery, useDeleteTargetUserMutation, useDeleteTargetPostMutation } = adminApiSlice;