import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { Game, PostGamesParams } from '../../../../shared/services/types'

export const gameApi = createApi({
  reducerPath: 'gameApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.retrogames.dev',
    prepareHeaders: headers => {
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  endpoints: builder => ({
    getGames: builder.query<Game[], PostGamesParams>({
      query: params => ({
        url: '/games',
        method: 'POST',
        body: params,
      }),
    }),
    getGame: builder.query<Game, number>({
      query: id => ({ url: `/games/${id}`, method: 'POST' }),
    }),
  }),
})

export const {
  useGetGamesQuery,
  useGetGameQuery,
  useLazyGetGamesQuery,
  useLazyGetGameQuery,
} = gameApi
