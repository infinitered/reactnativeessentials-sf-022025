### Chapter 4

Run `./scripts/skipTo 4` to copy the solution to your main app. Otherwise you may code along. Reference `./solutions/chapter4` if you get stuck.

# Chapter 4: Users can see the full games catalog

In this chapter, we will be working on building out the full games catalog screen of our app, where users can view all the games available in our catalog.

[Figma Design](https://www.figma.com/design/6Ip46lkbe5Ms1FvccKwOAd/Essentials-Workshop?node-id=728-983&p=f&t=pLCTfl2m8Jx1SkMF-0)

## Tasks for this section [code-a-long]

### 1. Create `GamesListScreen.tsx`

Move to `FlatList` for performance reasons. `ScrollView` is not performant and displays all items at once.

See [Flatlist Docs ](https://reactnative.dev/docs/flatlist)

```tsx
return (
  <FlatList
    data={games}
    style={$list}
    keyExtractor={item => String(item.id)}
    contentContainerStyle={[{ paddingBottom }, $contentContainer]}
    renderItem={({ item }) => (
      <Card
        onPress={() => {
          navigation.navigate('GameDetails', {
            gameId: item.id,
            name: item.name,
          })
        }}
        name={item.name}
        rating={item.totalRatingStars}
        releaseDate={item.releaseDate.human}
        imageUrl={item.cover.imageUrl}
      />
    )}
  />
)
```

### 2. Update `state.tsx` to create our games state

```tsx
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
```

### 3. Update `GamesListScreen.tsx` to fetch games from the API

```tsx
const { games, setGames } = useGlobalState()

const getGames = useCallback(async () => {
  const response = await api.getGames()
  if (response.ok) {
    setGames(response.data)
  }
}, [setGames])

useEffect(() => {
  getGames()
}, [getGames])
```

### 4. Update `App.tsx` to wrap our app in the `GlobalStateProvider`

```tsx
...
<GlobalStateProvider>
  ...
</GlobalStateProvider>
...
```

### 5. Update `Empty.tsx` component to show a message when there are no games

[figma design](https://www.figma.com/design/6Ip46lkbe5Ms1FvccKwOAd/Essentials-Workshop?node-id=47-6230&p=f&t=pLCTfl2m8Jx1SkMF-0)

```tsx
import React from 'react'
import type { TextStyle, ViewStyle } from 'react-native'
import { View } from 'react-native'

import { colors, sizes } from '../../shared/theme'
import type { IconProps } from './Icon'
import { Icon } from './Icon'
import { Text } from './Text'

export const Empty = (props: { text?: string; icon?: IconProps['name'] }) => {
  return (
    <View style={$emptyContentWrapper}>
      <Icon
        color={colors.tint.baseMuted}
        size={36}
        name={props.icon ?? 'frown'}
      />
      <Text
        preset="display"
        text={props.text ?? "There's\nNothing Here..."}
        style={$emptyText}
      />
    </View>
  )
}

const $emptyContentWrapper: ViewStyle = {
  flexDirection: 'row',
  paddingVertical: sizes.spacing.xl,
}

const $emptyText: TextStyle = {
  color: colors.text.baseMuted,
  marginStart: sizes.spacing.md,
}
```

### 6. Update `GamesListScreen.tsx` to show the `Empty` component when there are no games

```tsx
<FlatList
  ...
  ListEmptyComponent={<Empty />}
  ...
/>
```

### (DIY) 7. Add a loading state to the `GameDetailsScreen` component

If you finish early, add a loading state to the `GameDetailsScreen` component.

```tsx
{
  !game ? <Empty text={'Loading\nPlease Wait...'} icon="loader" /> : <>...</>
}
```

---

[Previous: Chapter 3](./chapter03.md) | [Next: Chapter 5](./chapter05.md)
