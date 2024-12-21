import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { PropsWithChildren } from 'react'
import { MMKV } from 'react-native-mmkv'

import {
  AppendReview,
  Favorites,
  Game,
  GlobalStateContextData,
  Reviews,
  ToggleFavorite,
} from '../../../shared/services/types'
import { safeParse } from '../../../shared/utils/object'
import { useAppState } from '../../../shared/utils/useAppState'

export const storage = new MMKV({ id: '@RNEssentials/global/state' })

const initFavorites = safeParse(storage.getString('favorites'), [])
const initReviews = safeParse(storage.getString('reviews'), {})

export const GlobalStateContext = createContext<GlobalStateContextData>({
  games: [],
  setGames: (_games: Array<Game>) => undefined,
  favorites: initFavorites,
  toggleFavorite: (_gameId: Game['id']) => undefined,
  reviews: initReviews,
  appendReview: (_gameId: Game['id'], _review: string) => undefined,
})

export const GlobalStateProvider = ({ children }: PropsWithChildren) => {
  const appState = useAppState()

  const [games, setGames] = useState<Array<Game>>([])
  const [favorites, setFavorites] = useState<Favorites>(initFavorites)
  const [reviews, setReviews] = useState<Reviews>(initReviews)

  const toggleFavorite: ToggleFavorite = useCallback(
    gameId => {
      let newFavorites: typeof favorites = []

      if (favorites.includes(gameId)) {
        newFavorites = favorites.filter(id => id !== gameId)
      } else {
        newFavorites = [...favorites, gameId]
      }

      setFavorites(newFavorites)
      storage.set('favorites', JSON.stringify(newFavorites))
    },
    [favorites, setFavorites],
  )

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
  
  useEffect(() => {
    if (appState === 'active') {
      const newReviewsFromStorage: Reviews = safeParse(
        storage.getString('reviews'),
        {},
      )

      setReviews(newReviewsFromStorage)
    }
  }, [appState])

  return (
    <GlobalStateContext.Provider
      value={{
        games,
        setGames,
        favorites,
        toggleFavorite,
        reviews,
        appendReview,
      }}>
      {children}
    </GlobalStateContext.Provider>
  )
}

export const useGlobalState = () => useContext(GlobalStateContext)
