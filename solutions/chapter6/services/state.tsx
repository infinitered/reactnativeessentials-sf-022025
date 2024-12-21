import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'
import type { PropsWithChildren } from 'react'
import { MMKV } from 'react-native-mmkv'

import type { AppendReview, Game, GlobalStateContextData, Reviews } from '../../../shared/services/types'
import { safeParse } from '../../../shared/utils/object'

const storage = new MMKV({ id: '@RNEssentials/global/state' })

const initReviews = safeParse(storage.getString('reviews'), {})

export const GlobalStateContext = createContext<
  Omit<GlobalStateContextData, 'favorites' | 'toggleFavorite'>
>({
  games: [],
  setGames: (_games: Array<Game>) => undefined,
  reviews: initReviews,
  appendReview: (_gameId: Game['id'], _review: string) => undefined,
})

export const GlobalStateProvider = ({ children }: PropsWithChildren) => {
  const [games, setGames] = useState<Array<Game>>([])
  const [reviews, setReviews] = useState<Reviews>(initReviews)

  const appendReview: AppendReview = useCallback(
    (gameId, review) => {
      const newReviews = {
        ...reviews,
        [gameId]: [review, ...(reviews[gameId] || [])],
      }

      setReviews(newReviews)
      storage.set('reviews', JSON.stringify(newReviews))
    },
    [reviews, setReviews],
  )

  return (
    <GlobalStateContext.Provider
      value={{
        games,
        setGames,
        reviews,
        appendReview,
      }}>
      {children}
    </GlobalStateContext.Provider>
  )
}

export const useGlobalState = () => useContext(GlobalStateContext)
