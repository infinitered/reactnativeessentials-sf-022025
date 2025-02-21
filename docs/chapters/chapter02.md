### Chapter 2

Run `./scripts/skipTo 2` to copy the solution to your main app. Otherwise you may code along. Reference `./solutions/chapter2` if you get stuck.

# Chapter 2: Users can navigate between screens

We now have a new [Figma design](https://www.figma.com/design/6Ip46lkbe5Ms1FvccKwOAd/Essentials-Workshop?node-id=728-541&p=f&t=pLCTfl2m8Jx1SkMF-0)! In this chapter, we will be working on building the navigation between screens in our app.

In mobile apps, we don't use URLs to navigate typically, we use navigation stacks. React Native has a few different options for navigation, but the most popular by far is the `react-navigation` library, which uses native navigation components.

Let's use react-navigation to create a **stack navigator** and navigate between the `GamesListScreen` and `GameDetailsScreen`.

### 1. Update `AppNavigator.tsx`

Update `AppNavigator` to wrap the `AppStack` in the `NavigationContainer`.

...

```jsx
// basically what you'd copy from the RNav docs

export const AppNavigator = (props: NavigationProps) => {
  const colorScheme = useColorScheme()

  return (
    <NavigationContainer
      initialState={initNavigation}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      onStateChange={state => storage.set('state', JSON.stringify(state))}
      {...props}>
      <AppStack />
    </NavigationContainer>
  )
}
```

> [!NOTE]
> We need `storage` and `initNavigation` to persist the navigation state.

```tsx
const storage = new MMKV({ id: '@RNEssentials/navigation/state' })
const initNavigation = safeParse(storage.getString('state'), undefined)
```

Update `AppStack` to use the `Stack.Navigator` and `Stack.Screen` components. Uncomment `Stack`.

```tsx
// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="GamesList"
      screenOptions={({ navigation }) => ({
        contentStyle: {
          borderTopColor: colors.border.base,
          borderTopWidth: 2,
        },
        headerStyle: {
          backgroundColor: colors.background.brand,
        },
        headerTitleAlign: "center",
        headerTintColor: colors.text.base,
        headerTitleStyle: {
          fontSize: 24,
          fontFamily: fonts.primary.semiBold,
        },
      })}
    >
      <Stack.Screen
        name="GamesList"
        component={GamesListScreen}
        options={{ title: "Retro Games" }}
      />
      <Stack.Screen
        name="GameDetails"
        component={GameDetailsScreen}
        options={({ route }) => ({ title: route.params.name })}
      />
    </Stack.Navigator>
  );
};
...
const $backButton: ViewStyle = {
  marginRight: sizes.spacing.md,
}
```

### 2. Update `App.tsx` to use navigation stack

Replace `GamesListScreen` with `AppNavigator`.

### 3. Update `GameDetailsScreen.tsx`

Update `GameDetailsScreen` to use the `ScreenProps` type and extract the `gameId` from the route params.

```tsx
import type { ScreenProps } from '../navigators/AppNavigator'

export const GameDetailsScreen = ({ route }: ScreenProps<'GameDetails'>) => {
  const gameId = route.params.gameId

  return (
    <View style={$view}>
      <Text preset="headline1" text={`Game Id: ${gameId}`} />
    </View>
  )
}

const $view: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background.primary,
}
```

Update our type definition for the `AppStackParamList` to include the `GamesList` and `GameDetails` screens.

```tsx
export type AppStackParamList = {
  GamesList: undefined
  GameDetails: { gameId: number; name: string }
}
```

### 4. Update `Card` component to be clickable

```tsx
interface CardProps {
  ...
  onPress: () => void
}
...
export const Card = (props: CardProps) => {
  const { ... onPress } = props

  return (
    <Pressable onPress={onPress}>
    ...
```

### 5. Update `GamesListScreen.tsx` to navigate to `GameDetailsScreen`

Pass in `onPress` to the `Card` component and navigate to the `GameDetails` screen.

```tsx
const navigation = useNavigation()
...
onPress={() => {
  navigation.navigate('GameDetails', {
    gameId: id,
    name: name,
  })
}}
```

Remove `paddingTop` since we now have a header

### 6. Customize the back icon

Add a `headerLeft` property to the `AppStack`.

```tsx
const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="GamesList"
      screenOptions={({ navigation }) => ({
        headerLeft: ({ canGoBack }) =>
          renderIconButton({
            name: "arrow-left-circle",
            onPress: canGoBack ? navigation.goBack : undefined,
          }),
...
```

> [!NOTE] > `renderIconButton` is a helper function to render an icon button with an onPress handler.

```tsx
function renderIconButton(props: IconProps & { onPress?: () => void }) {
  const {
    name,
    onPress,
    color = colors.tint.base,
    size = Platform.select({ ios: 24, android: 30 }),
  } = props

  if (!name) return null
  if (!onPress) return null

  return (
    <Pressable style={$backButton} onPress={onPress}>
      <Icon name={name} size={size} color={color} />
    </Pressable>
  )
}
```

---

[Previous: Chapter 1](./chapter01.md) | [Next: Chapter 3](./chapter03.md)
