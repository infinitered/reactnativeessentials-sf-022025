### Chapter 5

Run `./scripts/skipTo 5` to copy the solution to your main app. Otherwise you may code along. Reference `./solutions/chapter5` if you get stuck.

# Chapter 5: Users can view games by year released (DIY)

In this chapter, you will be working on building out the game list screen of our app, where users can view games by the year they were released.

[Figma Design](https://www.figma.com/design/6Ip46lkbe5Ms1FvccKwOAd/Essentials-Workshop?node-id=728-1467&p=f&t=pLCTfl2m8Jx1SkMF-0)

<img src="../images/chapter-5.png" width="250" />

## Tasks for this section [DIY]

### 1. Update `GamesListScreen.tsx` to use `SectionList`

Read through the [SectionList docs](https://reactnative.dev/docs/sectionlist)

Here is the code to put our data in the right shape and pass it to the SectionList

```tsx
const gamesSectionList = useMemo(() => {
    const initialValue: { [k: number]: Game[] } = {}
    const gameListMap = games.reduce((acc, curr) => {
      const year = curr.releaseDate.y
      if (acc[year]) {
        acc[year].push(curr)
      } else {
        acc[year] = [curr]
      }
      return acc
    }, initialValue)

    return Object.entries(gameListMap).map(([k, v]) => ({
      year: k,
      key: k,
      data: v,
    }))
  }, [games])

  return { gamesSectionList }
}

export const GamesListScreen = () => {
  const { bottom: paddingBottom } = useSafeAreaInsets()
  const navigation = useNavigation()
  const { gamesSectionList: games } = useGameData()

  return (
    <SectionList
      sections={games}
      ...
      initialNumToRender={6}
      maxToRenderPerBatch={20}
      windowSize={31}
      ...
      renderSectionHeader={({ section: { year } }) => <Pill text={year} />}
    />
  )
}
```

### 2. Update `Pill` component

Don't forget to inspect the [figma design](https://www.figma.com/design/6Ip46lkbe5Ms1FvccKwOAd/Essentials-Workshop?node-id=32-830&p=f&t=pLCTfl2m8Jx1SkMF-0) before you start.

```tsx
import React from 'react'
import type { TextStyle, ViewStyle } from 'react-native'
import { View } from 'react-native'

import { colors, sizes } from '../../shared/theme'
import { Text } from './Text'

interface PillProps {
  text: string
}

export const Pill = (props: PillProps) => {
  return (
    <View style={$pill}>
      <Text preset="label1" text={props.text} style={$text} />
    </View>
  )
}

const $pill: ViewStyle = {
  alignItems: 'center',
  alignSelf: 'flex-start',
  backgroundColor: colors.background.accent,
  borderColor: colors.border.base,
  borderRadius: sizes.radius.md,
  borderWidth: sizes.border.sm,
  height: sizes.spacing.xl,
  justifyContent: 'center',
  paddingHorizontal: sizes.spacing.md,
}

const $text: TextStyle = {
  color: colors.text.brand,
}
```
