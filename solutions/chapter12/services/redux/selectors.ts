import { createSelector } from '@reduxjs/toolkit'

import { RootState } from './store'

export const selectGameReviews = createSelector(
  [(state: RootState) => state.reviews, (_, gameId: number) => gameId],
  (reviews, gameId) => reviews[gameId] ?? [],
)

export const selectFavorites = (state: RootState) => state.favorites.items
