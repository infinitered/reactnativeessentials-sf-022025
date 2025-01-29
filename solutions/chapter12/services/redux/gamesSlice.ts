import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Game } from '../../../../shared/services/types'

interface GamesState {
  items: Game[]
}

const initialState: GamesState = {
  items: [],
}

export const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setGames: (state, action: PayloadAction<Game[]>) => {
      state.items = action.payload
    },
  },
})

export const { setGames } = gamesSlice.actions
export default gamesSlice.reducer
