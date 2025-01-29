import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Game } from '../../../../shared/services/types'

interface FavoritesState {
  items: Game['id'][]
}

const initialState: FavoritesState = {
  items: [],
}

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<Game['id']>) => {
      const gameId = action.payload
      const index = state.items.indexOf(gameId)

      if (index !== -1) {
        state.items.splice(index, 1)
      } else {
        state.items.push(gameId)
      }
    },
  },
})

export const { toggleFavorite } = favoritesSlice.actions
export default favoritesSlice.reducer
