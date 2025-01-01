import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect } from 'react'
import type { ViewStyle } from 'react-native'
import { Platform, Pressable, useColorScheme } from 'react-native'
import { MMKV } from 'react-native-mmkv'

import { colors, fonts, sizes } from '../../../shared/theme'
import { getObjectKeys, safeParse } from '../../../shared/utils/object'
import { useAppState } from '../../../shared/utils/useAppState'
import type { IconProps } from '../components/Icon'
import { Icon } from '../components/Icon'
import { GameDetailsScreen } from '../screens/GameDetailsScreen'
import { GamesListScreen } from '../screens/GamesListScreen'
import { ReviewScreen } from '../screens/ReviewScreen'
import {
  cancelScheduledNotifications,
  NotificationCategory,
  NotificationChannel,
  NotificationPressAction,
  NotificationType,
  scheduleLocalNotification,
  useNotificationEvents,
} from '../services/notifications'
import { useGlobalState } from '../services/state'

const storage = new MMKV({ id: '@RNEssentials/navigation/state' })

const initNavigation = safeParse(storage.getString('state'), undefined)

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  GamesList: undefined
  GameDetails: { gameId: number; name: string }
  Review: { gameId: number }
}

export type ScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamList {}
  }
}

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

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

const AppStack = () => {
  useNotificationEvents()

  return (
    <Stack.Navigator
      initialRouteName="GamesList"
      screenOptions={({ navigation }) => ({
        contentStyle: {
          borderTopColor: colors.border.base,
          borderTopWidth: 2,
        },
        headerLeft: ({ canGoBack }) =>
          renderIconButton({
            name: 'arrow-left-circle',
            onPress: canGoBack ? navigation.goBack : undefined,
          }),
        headerStyle: {
          backgroundColor: colors.background.brand,
        },
        headerTitleAlign: 'center',
        headerTintColor: colors.text.base,
        headerTitleStyle: {
          fontSize: 24,
          fontFamily: fonts.primary.semiBold,
        },
      })}>
      <Stack.Screen
        name="GamesList"
        component={GamesListScreen}
        options={{ title: 'Retro Games' }}
      />
      <Stack.Screen
        name="GameDetails"
        component={GameDetailsScreen}
        options={({ route }) => ({ title: route.params.name })}
      />
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

export const AppNavigator = (props: NavigationProps) => {
  const colorScheme = useColorScheme()
  const appState = useAppState()

  const { favorites, reviews, games } = useGlobalState()

  useEffect(() => {
    if (appState === 'background') {
      const reviewsIds = getObjectKeys(reviews).map(Number)

      const game = games.find(
        g => favorites.includes(g.id) && !reviewsIds.includes(g.id),
      )

      if (!game) return

      scheduleLocalNotification(
        {
          title: `Please Review: ${game.name}`,
          body: 'Looks like you enjoyed this game! Please leave a review!',
          data: {
            notificationType: NotificationType.GameReview,
            gameId: game.id,
            gameName: game.name,
          },
          ios: {
            categoryId: NotificationCategory.GameReview,
          },
          android: {
            channelId: NotificationChannel.Default,
            smallIcon: 'ic_notification_default',
            color: colors.text.accent,
            pressAction: { id: 'default' },
            actions: [
              {
                title: 'Review Game',
                input: true, // Android 14 has issues with input quick actions: https://github.com/invertase/notifee/issues/1002
                pressAction: { id: NotificationPressAction.SubmitReview },
              },
            ],
          },
        },
        5000,
      )
    }

    return () => {
      cancelScheduledNotifications()
    }
  }, [appState, favorites, reviews, games])

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

const $backButton: ViewStyle = {
  marginRight: sizes.spacing.md,
}
