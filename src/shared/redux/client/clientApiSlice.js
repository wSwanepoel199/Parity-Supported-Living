import { backendApi } from "../api/backendApi";
import { saveClient } from './clientSlice';

export const clientApiSlice = backendApi.injectEndpoints({
  endpoints: builder => ({
    getClients: builder.query({
      query: () => ({ url: '/clients', method: 'get' })
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

export const { useGetClientsQuery, useCreateClientMutation } = clientApiSlice;