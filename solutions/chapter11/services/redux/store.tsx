import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { MMKV } from 'react-native-mmkv'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'
import { Storage } from 'redux-persist/es/types'

import favoritesReducer from './favoritesSlice'
import { gameApi } from './gameApi'
import gamesReducer from './gamesSlice'
import reviewsReducer from './reviewsSlice'

// MMKV Storage Adapter
const storage = new MMKV({ id: '@RNEssentials/redux/state' })

const mmkvStorage: Storage = {
  setItem: (key, value) => {
    storage.set(key, value)
    return Promise.resolve()
  },
  getItem: key => {
    const value = storage.getString(key)
    return Promise.resolve(value)
  },
  removeItem: key => {
    storage.delete(key)
    return Promise.resolve()
  },
}

const persistedFavoritesReducer = persistReducer(
  { key: 'favorites', version: 1, storage: mmkvStorage },
  favoritesReducer,
)

const persistedReviewsReducer = persistReducer(
  { key: 'reviews', version: 1, storage: mmkvStorage },
  reviewsReducer,
)

const createEnhancers = (getDefaultEnhancers: any) => {
  if (__DEV__) {
    const reactotron =
      require('../../../../shared/utils/reactotronConfig').default
    return getDefaultEnhancers().concat(reactotron.createEnhancer())
  } else {
    return getDefaultEnhancers()
  }
}

export const store = configureStore({
  reducer: {
    games: gamesReducer,
    favorites: persistedFavoritesReducer,
    reviews: persistedReviewsReducer,
    [gameApi.reducerPath]: gameApi.reducer,
  },
  enhancers: createEnhancers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(gameApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store)
