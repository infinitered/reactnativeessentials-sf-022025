### Chapter 8

Run `./scripts/skipTo 8` to copy the solution to your main app. Otherwise you may code along. Reference `./solutions/chapter8` if you get stuck.

# Chapter 8: Blending in with our surroundings (light and dark mode)

In this chapter, you will implement a light and dark mode for your app.

   <img src="../images/chapter-8.png" width="250" />

Note: To toggle between light and dark mode, you can use the system settings on your device. Alternatively, you can:

- (iOS) Hit `Command + Shift + A` on iOS Simulator to toggle between light and dark mode.
- (Android) `adb shell "cmd uimode night no"`, `adb shell "cmd uimode night yes"` to toggle between light and dark mode.

## Tasks for this section [code-a-long]

### 1. Create a `theme.ts` file

#### a. Add the dark mode colors

```diff
+ import { changeHexAlpha, colors as lightColors } from '../../shared/theme'

+ const darkColors = {
+   background: {
+     primary: '#000000',
+     secondary: '#1a1a1a',
+     accent: '#099faa',
+     accentMuted: '#f8baf7',
+     brand: '#586600',
+     reflection: '#ffffff',
+     transparent: '#000000',
+   },
+   text: {
+     base: '#ffffff',
+     accent: '#f8baf7',
+     brand: '#d4f20d',
+     baseMuted: '#4d4d4d',
+     overlay: '#ffffff',
+   },
+   tint: {
+     accent: '#e61920',
+     baseMuted: '#4d4d4d',
+     base: '#ffffff',
+   },
+   border: {
+     base: '#ffffff',
+     accent: '#099faa',
+     transparent: '#000000',
+   },
+   manipulators: { changeHexAlpha },
+ } as const
```

#### b. Create types

```diff
+ // This supports "light" and "dark" themes by default. If undefined, it'll use the system theme
+ export type ThemeContexts = 'light' | 'dark' | undefined

+ // Because we have two themes, we need to define the types for each of them.
+ // colorsLight and colorsDark should have the same keys, but different values.
+ export type Colors = typeof darkColors | typeof lightColors

+ export interface Theme {
+   colors: Colors
+ }

+ // Here we define our themes.
+ export const lightTheme: Theme = {
+   colors: lightColors,
+ }

+ export const darkTheme: Theme = {
+   colors: darkColors,
+ }

+ /**
+  * Represents a function that returns a styled component based on the provided theme.
+  * @template T The type of the style.
+  * @param theme The theme object.
+  * @returns The styled component.
+  *
+  * @example
+  * const $container: ThemedStyle<ViewStyle> = (theme) => ({
+  *   flex: 1,
+  *   backgroundColor: theme.colors.background,
+  *   justifyContent: "center",
+  *   alignItems: "center",
+  * })
+  * // Then use in a component like so:
+  * const Component = () => {
+  *   const { themed } = useAppTheme()
+  *   return <View style={themed($container)} />
+  * }
+  */
+ export type ThemedStyle<T> = (theme: Theme) => T
+ export type ThemedStyleArray<T> = (
+   | ThemedStyle<T>
+   | StyleProp<T>
+   | (StyleProp<T> | ThemedStyle<T>)[]
+ )[]
```

#### c. Create our Theme React Provider & Context

```diff
+ type ThemeContextType = {
+   themeScheme: ThemeContexts
+ }

+ // create a React context and provider for the current theme
+ export const ThemeContext = createContext<ThemeContextType>({
+   themeScheme: undefined, // default to the system theme
+ })

+ export const useThemeProvider = () => {
+   const colorScheme = useColorScheme()
+   const [overrideTheme, setTheme] = useState<ThemeContexts>(
+     Appearance.getColorScheme() ?? undefined,
+   )

+   useEffect(() => {
+     const subscription = Appearance.addChangeListener(
+       ({ colorScheme: scheme }) => {
+         setTheme(scheme ?? undefined)
+       },
+     )

+     return () => subscription.remove()
+   }, [])

+   const themeScheme = overrideTheme || colorScheme || 'light'
+   const navigationTheme = themeScheme === 'dark' ? DarkTheme : DefaultTheme

+   return {
+     themeScheme,
+     navigationTheme,
+     ThemeProvider: ThemeContext.Provider,
+   }
+ }
```

#### d. Create our `useAppTheme` hook

```diff
+ interface UseAppThemeValue {
+   // The theme object from react-navigation
+   navTheme: typeof DefaultTheme
+   // The current theme object
+   theme: Theme
+   // The current theme context "light" | "dark"
+   themeContext: ThemeContexts
+   // A function to apply the theme to a style object.
+   themed: <T>(
+     styleOrStyleFn: ThemedStyle<T> | StyleProp<T> | ThemedStyleArray<T>,
+   ) => T
+ }

+ /**
+  * Custom hook that provides the app theme and utility functions for theming.
+  *
+  * @returns {UseAppThemeReturn} An object containing various theming values and utilities.
+  * @throws {Error} If used outside of a ThemeProvider.
+  */
+ export const useAppTheme = (): UseAppThemeValue => {
+   const navTheme = useNavTheme()
+   const context = useContext(ThemeContext)
+   if (!context) {
+     throw new Error('useTheme must be used within a ThemeProvider')
+   }

+   const { themeScheme: overrideTheme } = context

+   const themeContext: ThemeContexts = useMemo(
+     () => overrideTheme || (navTheme.dark ? 'dark' : 'light'),
+     [overrideTheme, navTheme],
+   )

+   const themeVariant: Theme = useMemo(
+     () => (themeContext === 'dark' ? darkTheme : lightTheme),
+     [themeContext],
+   )

+   const themed = useCallback(
+     <T>(
+       styleOrStyleFn: ThemedStyle<T> | StyleProp<T> | ThemedStyleArray<T>,
+     ) => {
+       const flatStyles = [styleOrStyleFn].flat(3) as (
+         | ThemedStyle<T>
+         | StyleProp<T>
+       )[]
+       const stylesArray = flatStyles.map(f => {
+         if (typeof f === 'function') {
+           return (f as ThemedStyle<T>)(themeVariant)
+         } else {
+           return f
+         }
+       })

+       // Flatten the array of styles into a single object
+       return Object.assign({}, ...stylesArray) as T
+     },
+     [themeVariant],
+   )

+   return {
+     navTheme,
+     theme: themeVariant,
+     themeContext,
+     themed,
+   }
+ }
```

### 2. Wrap `App.tsx` with a `ThemeProvider`

```diff
+ import { useThemeProvider } from './services/theme'

const App = (): React.JSX.Element | null => {
+   const { themeScheme, ThemeProvider } = useThemeProvider()

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GlobalStateProvider>
+         <ThemeProvider value={{ themeScheme }}>
            <AppNavigator />
+         </ThemeProvider>
      </GlobalStateProvider>
    </SafeAreaProvider>
  )
}
```

### 3. Update `AppNavigator.tsx` to use the theme

```tsx
export const AppNavigator = (props: NavigationProps) => {
  const { navigationTheme } = useThemeProvider()

  return (
    <NavigationContainer theme={navigationTheme} ...>
      <AppStack />
    </NavigationContainer>
  )
}
```

### 4. Update remaining `components`, `screens`, and `navigators` to use the theme

#### a. Update all `colors` references to use the theme

Search for all instances of `import { colors, fonts, sizes } from '../../shared/theme'` and replace to:

```diff
- import { colors, fonts, sizes } from '../../shared/theme'
+ import { fonts, sizes } from '../../shared/theme'
+ const { theme: { colors } } = useAppTheme()
```

#### b. Update the style to be a "themed" function

```diff
- const $card: ViewStyle = {
+ const $card: ThemedStyle<ViewStyle> = ({ colors }) => ({
  ...
- }
+ })
```

#### c. Update the style in the component to use the theme:

```diff
+ const { themed } = useAppTheme()
- <View style={$card}>
+ <View style={themed($card)}>
```

---

[Previous: Chapter 7](./chapter07.md) | [Next: Chapter 9](./chapter09.md)
