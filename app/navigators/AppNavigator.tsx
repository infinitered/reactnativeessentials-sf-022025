/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native'
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack'
import React from 'react'
import {useColorScheme} from 'react-native'
import {GameScreen} from '../screens/GameScreen/GameScreen'
import {GamesListScreen} from '../screens/GamesListScreen/GamesListScreen'
import {ReviewScreen} from '../screens/ReviewScreen/ReviewScreen'
import {TmpDevScreen} from '../screens/TmpDevScreen'

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  TmpDevScreen: undefined
  GamesList: undefined
  Game: {gameId: string}
  Review: {gameId: string}
}

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName="TmpDevScreen">
      <Stack.Screen
        name="TmpDevScreen"
        component={TmpDevScreen}
        options={{title: 'TmpDevScreen'}}
      />
      <Stack.Screen
        name="GamesList"
        component={GamesListScreen}
        options={{title: 'Retro Games'}}
      />
      <Stack.Screen name="Game" component={GameScreen} />
      <Stack.Screen
        name="Review"
        component={ReviewScreen}
        options={{presentation: 'modal'}}
      />
    </Stack.Navigator>
  )
}

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = (props: NavigationProps) => {
  const colorScheme = useColorScheme()

  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      {...props}>
      <AppStack />
    </NavigationContainer>
  )
}
