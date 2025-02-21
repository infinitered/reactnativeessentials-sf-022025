### Chapter 6

Run `./scripts/skipTo 6` to copy the solution to your main app. Otherwise you may code along. Reference `./solutions/chapter6` if you get stuck.

# Chapter 6: Users can add reviews

In this chapter, we will be working on building out the review screen of our app, where users can add reviews for games.

[Figma Design](https://www.figma.com/design/6Ip46lkbe5Ms1FvccKwOAd/Essentials-Workshop?node-id=728-1677&p=f&t=pLCTfl2m8Jx1SkMF-0)

## Tasks for this section [code-a-long]

### 1. Update `state.tsx` to handle reviews

#### a. Update `GlobalStateContext` to include `reviews` and `appendReview` while creating storage for reviews

```tsx
const storage = new MMKV({ id: '@RNEssentials/global/state' })

const initReviews = safeParse(storage.getString('reviews'), {})

export const GlobalStateContext = createContext<
-  Pick<GlobalStateContextData, 'games' | 'setGames'>
+  Omit<GlobalStateContextData, 'favorites' | 'toggleFavorite'>
>({
  ...
  reviews: initReviews,
  appendReview: (_gameId: Game['id'], _review: string) => undefined,
})
```

#### b. Update `GlobalStateProvider` to include `reviews` and `appendReview`

```tsx
...
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
      ...
      reviews,
      appendReview,
    }}>
    {children}
  </GlobalStateContext.Provider>
)
```

### 2. Update `GameDetailsScreen` to show reviews

#### a. Get `reviews` from global state

```tsx
const state = useGlobalState()
const reviews = gameId ? (state.reviews[gameId] ?? []) : []
```

#### b. In order to create our `Review` component, we need to create a `Button` component

After looking at [figma](https://www.figma.com/design/6Ip46lkbe5Ms1FvccKwOAd/Essentials-Workshop?node-id=5-6&p=f&t=pLCTfl2m8Jx1SkMF-0) we need to handle two states for the button: `pressed` and `base`.

```tsx
interface ButtonProps extends Omit<PressableProps, 'children'> {
  /**
   * The text to display.
   */
  text?: string
  /**
   * The icon to be displayed before the text.
   */
  icon?: IconProps['name']
  /**
   * Override the style of the button face element.
   */
  style?: StyleProp<ViewStyle>
}

export const Button = (props: ButtonProps) => {
  const { text, icon, style: $faceOverride, ...RestPressableProps } = props

  const $reflectionStyle: PressableProps['style'] = state => [
    $reflection,
    state.pressed && $reflectionPressed,
  ]

  const $faceStyle: PressableProps['style'] = state => [
    $face,
    $faceOverride,
    state.pressed && $facePressed,
  ]

  const $textStyle: PressableProps['style'] = state => [
    $text,
    state.pressed && $textPressed,
  ]

  const iconColor = (state: PressableStateCallbackType) =>
    state.pressed ? colors.text.brand : colors.text.base

  return (
    <Pressable {...RestPressableProps} style={$pressable}>
      {state => (
        <>
          <View style={$reflectionStyle(state)} />

          <View style={$faceStyle(state)}>
            {!!icon && <Icon name={icon} size={18} color={iconColor(state)} />}

            <Text preset="label1" text={text} style={$textStyle(state)} />
          </View>
        </>
      )}
    </Pressable>
  )
}

const $pressable: ViewStyle = {
  height: 50,
}

const $reflection: ViewStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  bottom: -6,
  right: -6,
  borderRadius: sizes.radius.md,
  backgroundColor: colors.background.transparent,
}

const $reflectionPressed: ViewStyle = {
  backgroundColor: colors.background.reflection,
}

const $face: ViewStyle = {
  flex: 1,
  borderWidth: sizes.border.sm,
  borderRadius: sizes.radius.md,
  flexDirection: 'row',
  paddingHorizontal: sizes.spacing.md,
  alignItems: 'center',
  justifyContent: 'center',
  columnGap: sizes.spacing.xs,
  backgroundColor: colors.background.brand,
  borderColor: colors.border.base,
}

const $facePressed: ViewStyle = {
  backgroundColor: colors.background.accent,
}

const $text: TextStyle = {
  color: colors.text.base,
}

const $textPressed: TextStyle = {
  color: colors.text.brand,
}
```

#### c. Create a `Review` component to display reviews

```tsx
const Reviews = ({ gameId, reviews }: ReviewsProps) => {
  const navigation = useNavigation()

  return (
    <>
      <View style={$reviewsHeaderWrapper}>
        <Text preset="label2">
          Reviews: <Text preset="title2" text={reviews.length.toString()} />
        </Text>
        <Button text="Write A Review" />
      </View>

      {reviews.map((review, index) => (
        <View key={index} style={$reviewWrapper}>
          <Text text={review} />
        </View>
      ))}
    </>
  )
}

const $reviewsHeaderWrapper: ViewStyle = {
  padding: sizes.spacing.md,
  rowGap: sizes.spacing.md,
  borderColor: colors.border.base,
  borderTopWidth: sizes.border.sm,
}

const $reviewWrapper: ViewStyle = {
  borderColor: colors.border.base,
  borderTopWidth: sizes.border.sm,
  padding: sizes.spacing.md,
}
```

#### d. Update `GameDetailsScreen` to show reviews

```tsx
return (
  ...
  <Reviews gameId={gameId} reviews={reviews} />
  ...
)
```

### 3. Create a `ReviewScreen`

```tsx
import React, { useCallback, useState } from 'react'
import type { TextStyle, ViewStyle } from 'react-native'
import { TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors, fonts, sizes } from '../../shared/theme'
import { Button } from '../components/Button'
import { Text } from '../components/Text'
import type { ScreenProps } from '../navigators/AppNavigator'
import { useGlobalState } from '../services/state'

export const ReviewScreen = ({ navigation, route }: ScreenProps<'Review'>) => {
  const { top: paddingTop } = useSafeAreaInsets()
  const [value, setValue] = useState('')

  const state = useGlobalState()
  const { gameId } = route.params

  const backToPrevious = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    } else {
      navigation.navigate('GamesList')
    }
  }, [navigation])

  const submitReview = useCallback(() => {
    if (value) {
      state.appendReview(gameId, value)
      backToPrevious()
    }
  }, [backToPrevious, gameId, value, state])

  return (
    <View style={$modal}>
      <View style={[$container, { paddingTop }]}>
        <Text style={$heading} preset="headline2" text="Write a Review" />
        <View style={$textArea}>
          <TextInput
            style={$textInput}
            placeholder="Type your reivew..."
            multiline
            value={value}
            onChangeText={setValue}
            placeholderTextColor={colors.text.baseMuted}
          />
        </View>
        <View style={$formActions}>
          <Button text="Submit Review" onPress={submitReview} />
          <Button
            text="Close"
            icon="x"
            style={$secondaryButton}
            onPress={backToPrevious}
          />
        </View>
      </View>
    </View>
  )
}

const $modal: ViewStyle = {
  flex: 1,
  backgroundColor: colors.manipulators.changeHexAlpha(
    colors.background.brand,
    75,
  ),
}

const $container: ViewStyle = {
  padding: sizes.spacing.md,
  backgroundColor: colors.background.primary,
  borderColor: colors.border.base,
  borderWidth: sizes.border.sm,
  borderTopWidth: 0,
  paddingBottom: sizes.spacing.md,
  borderBottomLeftRadius: sizes.spacing.lg,
  borderBottomRightRadius: sizes.spacing.lg,
}

const $heading: TextStyle = {
  marginVertical: sizes.spacing.md,
  textAlign: 'center',
}

const $textArea: ViewStyle = {
  borderColor: colors.border.base,
  borderWidth: sizes.border.sm,
  padding: sizes.spacing.sm,
  borderRadius: sizes.spacing.md,
  marginBottom: sizes.spacing.lg,
}

const $textInput: TextStyle = {
  fontFamily: fonts.primary.regular,
  color: colors.text.base,
  borderColor: colors.border.base,
  height: 84,
  overflow: 'scroll',
  textAlignVertical: 'top',
}

const $formActions: ViewStyle = {
  flexDirection: 'column',
  gap: sizes.spacing.md,
  marginTop: sizes.spacing.md,
}

const $secondaryButton: ViewStyle = {
  backgroundColor: colors.background.primary,
}
```

### 4. Add `ReviewScreen` to the navigation stack

```tsx
export type AppStackParamList = {
  GamesList: undefined
  GameDetails: { gameId: number; name: string }
  Review: { gameId: number }
}
...
const AppStack = () => {
  return (
    <Stack.Navigator ...>
      ...
      <Stack.Screen
        name="Review"
        component={ReviewScreen}
        options={{
          animation: 'fade_from_bottom',
          presentation: 'transparentModal',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}
```

### 5. Update `Review` component in `GameDetailsScreen` to navigate to `ReviewScreen`

```tsx
<Button
  text="Write A Review"
  onPress={() => navigation.navigate('Review', { gameId })}
/>
```
