# Redux and RTK

Run `./scripts/skipTo 11` to copy the solution to your main app. Otherwise you may code along. Reference `./solutions/chapter11` if you get stuck.

In this chapter, we will show how to convert our simple state management to use Redux and RTK.

This is a practical guide, but please reference the [Redux documentation](https://redux.js.org/introduction/core-concepts) for more theoretical understanding of Redux and it's principles.

## Basic Concepts

- State is a plain object, and that object is the single source of truth.

```js
{
  todos: [{
    text: 'Eat food',
    completed: true
  }, {
    text: 'Exercise',
    completed: false
  }],
  visibilityFilter: 'SHOW_COMPLETED'
}
```

This object is cannot be modified directly

- Changes to the state must take place via actions. Actions are represented by plain objects. They act like breadcrumbs to understand how state has changed over time.

```js
{ type: 'ADD_TODO', text: 'Go to swimming pool' }
{ type: 'TOGGLE_TODO', index: 1 }
{ type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_ALL' }
```

- Reducers are what tie state and actions together. Nothing magical, just functions that take state + action, and return the next state.

```js
function visibilityFilter(state = 'SHOW_ALL', action) {
  if (action.type === 'SET_VISIBILITY_FILTER') {
    return action.filter
  } else {
    return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([{ text: action.text, completed: false }])
    case 'TOGGLE_TODO':
      return state.map((todo, index) =>
        action.index === index
          ? { text: todo.text, completed: !todo.completed }
          : todo,
      )
    default:
      return state
  }
}
```

Then the app has one "main" reducer that manages the complete app state by knowing which reducer to call for each state key.

```
function todoApp(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    visibilityFilter: visibilityFilter(state.visibilityFilter, action)
  }
}
```

## Redux Toolkit (RTK)

[Read the docs](https://redux-toolkit.js.org/usage/usage-guide)

Redux Toolkit is a library that was created to help reduce some of the boilerplate that was common with plain redux.

### Terms

- Store. This is the "main" reducer that manages the complete state for our app.
- Slice. This is an individual piece of our state. For our app, we will have three slices: Games Slice, Reviews Slice, and Favorites Slice.
- Selector. A special function that selects a small piece of state for use in the app.
- Dispatch. The function used for triggering actions.

## RTK Query

[Read the docs here](https://redux-toolkit.js.org/rtk-query/overview)

"RTK Query is a powerful data fetching and caching tool. It is designed to simplify common cases for loading data in a web application, eliminating the need to hand-write data fetching & caching logic yourself."

We will be using it for fetching the games from the API

## Creating our slices

Let's start by defining what we want our state to look like (our data model).

Create the `redux` folder within `services`.

### Games Slice

First we'll define the shape by creating our initial state with type

```ts
import { Game } from '../../../../shared/services/types'

interface GamesState {
  items: Game[]
}

const initialState: GamesState = {
  items: [],
}
```

Next we'll create our reducers. We'll do this with the RTK helper `createSlice`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
```

We'll do the same for favorites and reviews (copy from [diffs](../diffs/chapter11.md#solutionschapter10servicesreduxfavoritesslicets--solutionschapter11servicesreduxfavoritesslicets))

### Create the main store

Once we have our slices, we can create our main store

```ts
import favoritesReducer from './favoritesSlice'
import gamesReducer from './gamesSlice'
import reviewsReducer from './reviewsSlice'

export const store = configureStore({
  reducer: {
    games: gamesReducer,
    favorites: favoritesReducer,
    reviews: reviewsReducer,
  },
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

We'll also need to add a provider wrapping our main app component:

```diff
   initialWindowMetrics,
   SafeAreaProvider,
 } from 'react-native-safe-area-context'
+import { Provider } from 'react-redux'

 import { AppNavigator } from './navigators/AppNavigator'
-import { GlobalStateProvider } from './services/state'
+import { store } from './services/redux/store'
 import { useThemeProvider } from './services/theme'

 const App = (): React.JSX.Element | null => {

   return (
     <SafeAreaProvider initialMetrics={initialWindowMetrics}>
-      <GlobalStateProvider>
+      <Provider store={store}>
         <ThemeProvider value={{ themeScheme }}>
           <AppNavigator />
         </ThemeProvider>
-      </GlobalStateProvider>
+      </Provider>
     </SafeAreaProvider>
   )
 }
```

## RTK Query / API

Let's re-create our API with RTK Query

```diff
+import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
+
+import { Game, PostGamesParams } from '../../../../shared/services/types'
+
+export const gameApi = createApi({
+  reducerPath: 'gameApi',
+  baseQuery: fetchBaseQuery({
+    baseUrl: 'https://api.retrogames.dev',
+    prepareHeaders: headers => {
+      headers.set('Content-Type', 'application/json')
+      return headers
+    },
+  }),
+  endpoints: builder => ({
+    getGames: builder.query<Game[], PostGamesParams>({
+      query: params => ({
+        url: '/games',
+        method: 'POST',
+        body: params,
+      }),
+    }),
+    getGame: builder.query<Game, number>({
+      query: id => ({ url: `/games/${id}`, method: 'POST' }),
+    }),
+  }),
+})
+
+export const {
+  useGetGamesQuery,
+  useGetGameQuery,
+  useLazyGetGamesQuery,
+  useLazyGetGameQuery,
+} = gameApi
```

Then we'll hook it up in our `store`.

Add the game api reducer

```diff
+ [gameApi.reducerPath]: gameApi.reducer,
```

Add api middleware

```diff
+    }).concat(gameApi.middleware),
```

### Selectors

```diff
import { createSelector } from '@reduxjs/toolkit'
+
+import { RootState } from './store'
+
+export const selectGameReviews = createSelector(
+  [(state: RootState) => state.reviews, (_, gameId: number) => gameId],
+  (reviews, gameId) => reviews[gameId] ?? [],
+)
+
+export const selectFavorites = (state: RootState) => state.favorites.items
```

## Hook it up to our screens

### Game List

1. Let's get our data from RTK instead of global state

```diff
-  const { favorites, games, setGames } = useGlobalState()
+  const { data: games = [] } = useGetGamesQuery({})
+  const favorites = useSelector((state: RootState) => state.favorites.items)
```

2. Remove getGames function and useEffect

3. Reload!

### Now let's do the game detail. This one is a bit more complicated.

1. Get data from RTK

```diff
-  const state = useGlobalState()
-  const reviews = gameId ? (state.reviews[gameId] ?? []) : []

-  const { favorites, toggleFavorite } = useGlobalState()
-  const [isFavorite, setFavorite] = useState(
-    Boolean(favorites.find(favoriteGameId => favoriteGameId === gameId)),
-  )
-  const [game, setGame] = useState<Game | undefined>()
```

2. Add selector for reviews and favorites, and add query for

```jsx
const reviews = useSelector(state => selectGameReviews(state, gameId))
const favorites = useSelector(selectFavorites)

const { data: game, isLoading } = useGetGameQuery(gameId)
const [isFavorite, setFavorite] = useState(favorites.includes(gameId))
```

3. Remove useEffect and getGame. This is covered by useGetGameQuery now.

```jsx
const getGame = useCallback(async () => {
  const response = await api.getGame(gameId)

  if (response.ok) {
    setGame(response.data)
  }
}, [setGame, gameId])

useEffect(() => {
  getGame()
}, [getGame])
```

4. Replace with useEffect that calls dispatch

```jsx
useEffect(() => {
  if (isFavorite !== favorites.includes(gameId)) {
    dispatch(toggleFavorite(gameId))
  }
}, [isFavorite, gameId, dispatch, favorites])
```

5. Use the `isLoading` flag from RTK instead of !game

```diff
-        {!game ? (
+        {isLoading ? (
```

### Review Screen (DIY)

Instead of `state.appendReview`, we're doing to use `dispatch(appendReview({ gameId, review: value }))`

## Redux Persist

It's going to be important to maintain our state when the app closes, so for that we use `redux-persist`.

[See the docs ](https://redux-toolkit.js.org/rtk-query/usage/persistence-and-rehydration#redux-persist)

There are two steps to implement.

1. In our store

```ts
// MMKV Storage Adapter
const storage = new MMKV({ id: '@RNEssentials/redux/state' })

const mmkvStorage: Storage = {
  setItem: async (key, value) => {
    storage.set(key, value)
  },
  getItem: async key => {
    return storage.getString(key)
  },
  removeItem: async key => {
    storage.delete(key)
  },
}
```

Persist config

```ts
const persistConfig = {
  key: 'root',
  version: 1,
  storage: mmkvStorage,
  whitelist: ['favorites', 'reviews'],
}
```

Persisted reducers

```js
const persistedFavoritesReducer = persistReducer(
  { ...persistConfig, key: 'favorites' },
  favoritesReducer,
)

const persistedReviewsReducer = persistReducer(
  { ...persistConfig, key: 'reviews' },
  reviewsReducer,
)
```

NOTE: we don't persist our games reducer because that is managed by RTK Query

Update our `configureStore` call

```ts
  reducer: {
    games: gamesReducer,
    favorites: persistedFavoritesReducer,
    reviews: persistedReviewsReducer,
    [gameApi.reducerPath]: gameApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(gameApi.middleware),
```

2. We need to add a `PersistGate` wrapper to our main app

```diff
+import { PersistGate } from 'redux-persist/integration/react'

 import { AppNavigator } from './navigators/AppNavigator'
 import { GlobalStateProvider } from './services/state'
-import { store } from './services/redux/store'
+import { persistor, store } from './services/redux/store'



     <SafeAreaProvider initialMetrics={initialWindowMetrics}>
       <Provider store={store}>
+        <PersistGate loading={null} persistor={persistor}>
         <ThemeProvider value={{ themeScheme }}>
           <AppNavigator />
         </ThemeProvider>
+        </PersistGate>
       </Provider>
     </SafeAreaProvider>
```

## Reactotron

0. See [Reactotron Docs ](https://github.com/infinitered/reactotron) to install and get it running.

Reactotron has a plugin that will allow us to inspect our redux state

`yarn add -D reactotron-redux` (already done)

1. In ReactotronConfig, add

```diff
  .use(reactotronRedux())
```

2. To our `store.tsx` add:

```ts
+const createEnhancers = (getDefaultEnhancers: any) => {
+  if (__DEV__) {
+    const reactotron =
+      require('../../../../shared/utils/reactotronConfig').default
+    return getDefaultEnhancers().concat(reactotron.createEnhancer())
+  } else {
+    return getDefaultEnhancers()
+  }
+}
+
```

3. In the `configureStore` call add:

```diff
+  enhancers: createEnhancers,
```

Then run reactotron and inspect your slices

## Resources

https://redux.js.org/tutorials/essentials/part-1-overview-concepts (top down)
https://redux.js.org/tutorials/fundamentals/part-1-overview (bottom up)
https://www.learnwithjason.dev/let-s-learn-modern-redux

---

[Previous: Chapter 10](./chapter10.md) | [Next: Chapter 12](./chapter12.md)
