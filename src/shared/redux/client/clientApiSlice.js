import { backendApi } from "../api/backendApi";
import { saveClients } from './clientSlice';

export const clientApiSlice = backendApi.injectEndpoints({
  endpoints: builder => ({
    getAllClients: builder.query({
      query: () => ({ url: '/clients/', method: 'get' }),
      async onQueryStarted(client, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(saveClients(data.data.data));
        }
        catch (err) {
          console.error(err);
        }
      }
    }),
    createClient: builder.mutation({
      query: (client) => ({ url: '/clients/create', method: 'post', data: client }),
      async onQueryStarted(client, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          // dispatch(saveClient(data.data.data));
        }
        catch (err) {
          console.error(err);
        }
      }
    })
  })
});

export const { useGetAllClientsQuery, useCreateClientMutation } = clientApiSlice;