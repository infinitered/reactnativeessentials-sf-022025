import type { PropsWithChildren } from 'react'
import React, { createContext, useCallback, useContext, useState } from 'react'
import { MMKV } from 'react-native-mmkv'

import {
  AppendReview,
  Favorites,
  Game,
  GlobalStateContextData,
  Reviews,
  ToggleFavorite,
} from '../../shared/services/types'
import { safeParse } from '../../shared/utils/object'
import NativeLocalStorage from '../../specs/NativeLocalStorage'

const storage = new MMKV({ id: '@RNEssentials/global/state' })

const NativeStorageKey = 'favorites'
const initFavorites = safeParse(
  NativeLocalStorage.getItem(NativeStorageKey) ?? undefined,
  [],
)
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
  const [games, setGames] = useState<Array<Game>>([])
  const [favorites, setFavorites] = useState<Favorites>(initFavorites ?? [])
  const [reviews, setReviews] = useState<Reviews>(initReviews)

  const toggleFavorite: ToggleFavorite = useCallback(
    (gameId, value) => {
      const isCurrentlyFavorited = favorites.includes(gameId)

      // Determine the new favorite status
      const shouldBeFavorited =
        value === undefined
          ? !isCurrentlyFavorited // Toggle when no value provided
          : value // Use explicit value when provided

      // Only update if there's a change
      if (shouldBeFavorited === isCurrentlyFavorited) {
        return // No change needed
      }

      // Create new favorites array
      const newFavorites = shouldBeFavorited
        ? [...favorites, gameId]
        : favorites.filter(id => id !== gameId)

      setFavorites(newFavorites)
      NativeLocalStorage.setItem(JSON.stringify(newFavorites), NativeStorageKey)
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
