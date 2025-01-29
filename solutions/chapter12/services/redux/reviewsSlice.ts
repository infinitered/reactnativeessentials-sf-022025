import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Game } from '../../../../shared/services/types'

interface ReviewsState {
  [gameId: number]: string[]
}

const initialState: ReviewsState = {}

export const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    appendReview: (
      state,
      action: PayloadAction<{ gameId: Game['id']; review: string }>,
    ) => {
      const { gameId, review } = action.payload

      if (!state[gameId]) {
        state[gameId] = []
      }

      state[gameId].unshift(review)
    },
  },
})

export const { appendReview } = reviewsSlice.actions
export default reviewsSlice.reducer
