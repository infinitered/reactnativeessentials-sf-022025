import type { PropsWithChildren } from 'react'
import React, { createContext, useContext, useState } from 'react'

import type {
  Game,
  GlobalStateContextData,
} from '../../../shared/services/types'

export const GlobalStateContext = createContext<
  Pick<GlobalStateContextData, 'games' | 'setGames'>
>({
  games: [],
  setGames: (_games: Array<Game>) => undefined,
})

export const GlobalStateProvider = ({ children }: PropsWithChildren) => {
  const [games, setGames] = useState<Array<Game>>([])

  return (
    <GlobalStateContext.Provider
      value={{
        games,
        setGames,
      }}>
      {children}
    </GlobalStateContext.Provider>
  )
}

export const useGlobalState = () => useContext(GlobalStateContext)
