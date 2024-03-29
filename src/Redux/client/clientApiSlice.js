import { backendApi } from "../api/backendApi";
import { saveClients } from './clientSlice';

export const clientApiSlice = backendApi.injectEndpoints({
  endpoints: builder => ({
    getAllClients: builder.query({
      query: () => ({ url: '/clients', method: 'get' }),
      providesTags: (result, error, args) =>
        result
          ? [...result.data.data?.map(({ id }) => ({ type: 'client', id })),
          { type: 'client', id: "LIST" },
          ]
          : [{ type: 'client', id: "LIST" }],
      async onQueryStarted(undefiend, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(saveClients(data.data.data));
        }
        catch (err) {
          console.error(err);
        }
      }
    }),
    getClient: builder.query({
      query: (clientId) => ({ url: '/clients/get/' + clientId, method: "get" }),
      transformResponse: (response, meta, arg) => response.data.data,
      async onQueryStarted(clientId, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          return data;
        }
        catch (err) {
          console.error(err);
        }
      }
    }),
    createClient: builder.mutation({
      query: (newClient) => ({ url: '/clients/create', method: 'post', data: newClient }),
      async onQueryStarted(newClient, { queryFulfilled }) {
        try {
          await queryFulfilled;
        }
        catch (err) {
          console.error(err);
        }
      },
      invalidatesTags: (result, error, args) =>
        result ? [{ type: "client", id: "LIST" }, { type: 'user', id: "LIST" }] : error ? console.error(error) : null
    }),
    removeClient: builder.mutation({
      query: (targetClient) => ({ url: '/clients/delete/' + targetClient, method: 'get' }),
      invalidatesTags: (result, error, args) =>
        result ? [{ type: "client", id: "LIST" }, { type: 'user', id: 'LIST' }, { type: 'post', id: 'LIST' }] : error ? console.error(error) : null
    }),
    updateClient: builder.mutation({
      query: (updatedClient) => ({ url: '/clients/update', method: 'put', data: updatedClient }),
      invalidatesTags: (result, error, args) =>
        result ? [{ type: "client", id: "LIST" }, { type: 'user', id: 'LIST' }, { type: 'post', id: "LIST" }] : error ? console.error(error) : null,
    })
  })
});

export const { useGetAllClientsQuery, useGetClientQuery, useCreateClientMutation, useRemoveClientMutation, useUpdateClientMutation } = clientApiSlice;