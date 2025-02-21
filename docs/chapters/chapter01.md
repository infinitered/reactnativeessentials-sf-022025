### Chapter 1

Run `./scripts/skipTo 1` to copy the solution to your main app, otherwise you may code along. Reference `./solutions/chapter1` if you get stuck.

# Chapter 1: Users can view games

In this chapter, we will be working on building the first screen of our app, where users can view a list of games using reusable components.

Our design team has provided us with this [figma design](https://www.figma.com/design/6Ip46lkbe5Ms1FvccKwOAd/Essentials-Workshop?node-id=0-1&p=f&t=pLCTfl2m8Jx1SkMF-0) that we will use along the way while developing this app.

[Figma Design](https://www.figma.com/design/6Ip46lkbe5Ms1FvccKwOAd/Essentials-Workshop?node-id=728-327&p=f&t=pLCTfl2m8Jx1SkMF-0)

## Tasks for this section [code-a-long]

### 1. Update `app/screens/GamesListScreen.tsx` to show a list of games

Steps:

- Wrapper `<View />` component add `style` prop: `{ flex: 1, paddingHorizontal: sizes.spacing.md }`
- Loop through `games` array and display each game as below (note that we are using mock data right now)
- Update to handle `SafeAreaView` using hook: `const { bottom: paddingBottom, top: paddingTop } = useSafeAreaInsets()`

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { bottom: paddingBottom, top: paddingTop } = useSafeAreaInsets()

return (
  <View
    style={{
      flex: 1,
      paddingHorizontal: sizes.spacing.md,
      paddingTop,
      paddingBottom,
    }}>
    {games.map(({ id, name, cover }) => (
      <View
        key={id}
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: sizes.spacing.md,
          marginBottom: sizes.spacing.lg,
        }}>
        <Image
          source={{ uri: cover.imageUrl }}
          style={{
            height: 120,
            width: 90,
          }}
        />
        <Text>{name}</Text>
      </View>
    ))}
  </View>
)
```

### 2. Discuss `ScrollView`

See [ScrollView Docs](https://reactnative.dev/docs/scrollview)

1. Replace wrapper `<View />` with `<ScrollView />` to make the screen scrollable
2. Make sure to use `contentContainerStyle` prop instead of `style`

### 3. Update styles

In React Native, we don't have HTML tags because it renders to Native components. Instead, we use the `<View>` component and wrap all text in a `<Text>` component. CSS in React Native is similar to CSS, but everything is in `camelCase`. React Native has some "extras" like `paddingVertical`, `paddingHorizontal`, `marginVertical`, and `marginHorizontal`.

#### StyleProp types: `<ViewStyle>`, `<ImageStyle>`, `<TextStyle>`

When doing styles, the types `<ViewStyle>`, `<ImageStyle>`, and `<TextStyle>` are exported from `react-native` and are very helpful because they give intellisense completions for all your styles.

#### Can Styles Be Slow?

Styles are often the cause of unnecessary re-renders, which leads to poor performance. For example, in the following code, the style object is a different object on every render, causing the `Text` component to re-render every time:

```tsx
function Greeting(name: string) {
  // this will be different
  const greetingStyle: ViewStyle = { color: 'red' }

  return <Text style={greetingStyle}>Hello {name}!</Text>
}
```

To fix this, we can declare our styles outside of the function body, so the prop receives the same object every time:

```tsx
function Greeting(name: string) {
  return <Text style={$greetingStyle}>Hello {name}!</Text>
}

const $greetingStyle: ViewStyle = { color: 'red' }
```

```tsx
return (
  <ScrollView style={[{ paddingBottom, paddingTop }, $contentContainer]}>
    {games.map(({ id, name, cover }) => (
      <View key={id} style={$game}>
        <Image source={{ uri: cover.imageUrl }} style={$image} />
        <Text>{name}</Text>
      </View>
    ))}
  </ScrollView>
)
...
const $contentContainer: ViewStyle = {
  flex: 1,
  paddingHorizontal: sizes.spacing.md,
}
const $game: ViewStyle = {
  alignItems: 'center',
  flexDirection: 'row',
  gap: sizes.spacing.md,
  marginBottom: sizes.spacing.lg,
}
const $image: ImageStyle = {
  height: 120,
  width: 90,
}
```

### 4. Using the inspector

The React-Native inspector is a useful tool for examining how styles are applied in your app. To use it, follow these steps:

1. On an iOS Simulator or Android Emulator, shake the device or press CMD+D or CMD+M, respectively.
2. Select "Show Element Inspector" from the menu that appears.
3. Tap on any element in your app to inspect it.

Also show this in the React Native debugger

#### Parts of the Inspector:

1. The parents of the selected component are listed. You can select any of these names to inspect that component instead.
2. The styles applied to the selected component are listed.
3. The box-spacing model of the component (including margins, padding, etc.) is displayed.
4. Other tabs provide access to additional inspection and profiling tools.

### 5. Extract the `Card` component

Move code to a new `Card` component as is and then update it to match final [figma design](https://www.figma.com/design/6Ip46lkbe5Ms1FvccKwOAd/Essentials-Workshop?node-id=18-242&p=f&t=pLCTfl2m8Jx1SkMF-0).

### 6. Create a `Icon` component

Icon component to be used in the `Card` component as stars. Let's not forget to inspect the icon in the [Figma design](https://www.figma.com/design/6Ip46lkbe5Ms1FvccKwOAd/Essentials-Workshop?node-id=16-91&p=f&t=pLCTfl2m8Jx1SkMF-0).

### 7. Create a `Text` component

Reusable `Text` component to be used in the `Card` component.
