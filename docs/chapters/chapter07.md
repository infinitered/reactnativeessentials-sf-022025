### Chapter 7

Run `./scripts/skipTo 7` to copy the solution to your main app. Otherwise you may code along. Reference `./solutions/chapter7` if you get stuck.

# Chapter 7: Users can save favorites (DIY)

In this chapter, you will implement the ability for users to save their favorite games.

[Figma Design](https://www.figma.com/design/6Ip46lkbe5Ms1FvccKwOAd/Essentials-Workshop?node-id=728-1913&p=f&t=pLCTfl2m8Jx1SkMF-0)

## Tasks for this section [DIY]

### 1. Update `state.tsx` to include a `favorites`

```tsx
const initFavorites = safeParse(storage.getString('favorites'), [])
...
export const GlobalStateContext = createContext<GlobalStateContextData>({
  ...
  favorites: initFavorites,
  toggleFavorite: (_gameId: Game['id']) => undefined,
  ...
})
...
export const GlobalStateProvider = ({ children }: PropsWithChildren) => {
  ...
  const [favorites, setFavorites] = useState<Favorites>(initFavorites)
  ...
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
  ...
  return (
    <GlobalStateContext.Provider
      value={{
        ...
        favorites,
        toggleFavorite,
        ...
      }}>
      {children}
    </GlobalStateContext.Provider>
  )
})
```

### 2. Create a new component `Switch.tsx`

Don't forget to reference the [figma design](https://www.figma.com/design/6Ip46lkbe5Ms1FvccKwOAd/Essentials-Workshop?node-id=40-5822&p=f&t=pLCTfl2m8Jx1SkMF-0).

```tsx
import React from 'react'
import type { ViewStyle } from 'react-native'
import { Switch as RNSwitch, View } from 'react-native'

import { colors } from '../../shared/theme'

interface SwitchProps {
  on: boolean
  onToggle: () => void
}

export const Switch = (props: SwitchProps) => {
  const { on, onToggle } = props
  return (
    <View style={$container}>
      <RNSwitch
        ios_backgroundColor={
          on ? colors.background.accent : colors.background.accentMuted
        }
        onValueChange={onToggle}
        thumbColor={on ? colors.background.brand : colors.background.accent}
        trackColor={{
          false: colors.background.accentMuted,
          true: colors.background.accent,
        }}
        value={on}
      />
    </View>
  )
}

const $container: ViewStyle = {
  alignItems: 'center',
  height: 31,
  justifyContent: 'center',
  width: 51,
}
```

### 3. Update `GamesListScreen` to include the add to favorites banner

```tsx
function useGameData() {
  const { favorites, games, setGames } = useGlobalState()
  const [filterFavorites, setFilterFavorites] = useState(false)
  ...
  const gamesSectionList = useMemo(() => {
    const initialValue: { [k: number]: Game[] } = {}
    const gameListMap = games.reduce((acc, curr) => {
+      if (filterFavorites && !favorites.includes(curr.id)) return acc
    })
  })
}
...
export const GamesListScreen = () => {
  const {
    gamesSectionList: games,
+    filterFavorites,
+    setFilterFavorites,
  } = useGameData()
  return (
    <>
      <View style={$favoritesFilter}>
        <Text preset="title1" text="Show Favorites" />
        <Switch
          on={filterFavorites}
          onToggle={() => setFilterFavorites(!filterFavorites)}
        />
      </View>
      ...
    </>
  )
}
```

### 4. Update `GameDetailsScreen` to include the add to favorites in banner

```tsx
export const GameDetailsScreen = ({ route }: ScreenProps<'GameDetails'>) => {
  ...
  const { favorites, toggleFavorite } = useGlobalState()
  ...
  const {
    id,
    ...
  } = game ?? {}

  return (
    ...
    {!!id && (
      <View style={$favoriteWrapper}>
        <Text
          style={$favoriteLabel}
          preset="title1"
          text="Add to Favorites"
        />
        <Switch
          on={Boolean(
            favorites.find(favoriteGameId => favoriteGameId === id),
          )}
          onToggle={() => toggleFavorite(id)}
        />
      </View>
    )}
    ...
  )
})
...
const $favoriteWrapper: ViewStyle = {
  position: 'absolute',
  right: sizes.spacing.md,
  top: sizes.spacing.md,
  flexDirection: 'row',
  alignItems: 'center',
  gap: sizes.spacing.xs,
}
const $favoriteLabel: TextStyle = {
  color: colors.text.overlay,
  textShadowColor: colors.manipulators.changeHexAlpha(colors.text.base, 40),
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 1,
}
```

---

[Previous: Chapter 6](./chapter06.md) | [Next: Chapter 8](./chapter08.md)
