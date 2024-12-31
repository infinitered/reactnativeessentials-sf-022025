import type {
  AndroidChannel,
  EventDetail,
  InitialNotification,
  IOSNotificationCategory,
  Notification,
  TimestampTrigger,
} from '@notifee/react-native'
import notifee, {
  AndroidImportance,
  AndroidNotificationSetting,
  AuthorizationStatus,
  EventType,
  TriggerType,
} from '@notifee/react-native'
import type { NavigationHelpers } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import { Platform } from 'react-native'

import type { Reviews } from '../../../shared/services/types'
import { safeParse } from '../../../shared/utils/object'
import { useAppState } from '../../../shared/utils/useAppState'
import type { AppStackParamList } from '../navigators/AppNavigator'
import { storage as stateStorage } from './state'

const navigationQueue: { name: string; params?: object | undefined }[] = []

export enum NotificationType {
  GameReview,
}

export enum NotificationCategory {
  GameReview = 'game-review',
}

export enum NotificationChannel {
  Default = 'default',
}

export enum NotificationPressAction {
  SubmitReview = 'submit-review',
}

const androidChannels: AndroidChannel[] = [
  {
    id: NotificationChannel.Default,
    name: 'Default',
    description: 'General app notifications.',
    importance: AndroidImportance.HIGH,
    badge: false,
  },
]

const iosCategories: IOSNotificationCategory[] = [
  {
    id: NotificationCategory.GameReview,
    actions: [
      {
        id: NotificationPressAction.SubmitReview,
        title: 'Review Game',
        input: {
          placeholderText: 'Type your review...',
          buttonText: 'Submit',
        },
      },
    ],
  },
]

function handleNotificationPress(
  detail: EventDetail | InitialNotification,
  navigate?: NavigationHelpers<AppStackParamList>['navigate'],
) {
  if (!detail.notification) return

  const navigateFn =
    navigate ?? ((name, params) => navigationQueue.push({ name, params }))

  switch (detail.notification.data?.notificationType) {
    case NotificationType.GameReview:
      const gameId = detail.notification.data?.gameId as number
      const gameName = detail.notification.data?.gameName as string

      navigateFn('GameDetails', { gameId, name: gameName })
      navigateFn('Review', { gameId })
      break
    default:
      break
  }
}

async function handleNotificationActionPress(
  detail: EventDetail | InitialNotification,
) {
  if (!detail.notification) return

  switch (detail.pressAction?.id) {
    case NotificationPressAction.SubmitReview:
      if (!detail.input) break

      const gameId = detail.notification.data?.gameId as number
      const reviews: Reviews = safeParse(stateStorage.getString('reviews'), {})
      const newReviews = {
        ...reviews,
        [gameId]: [detail.input, ...(reviews[gameId] || [])],
      }

      stateStorage.set('reviews', JSON.stringify(newReviews))
      break
    default:
      break
  }

  await notifee.cancelNotification(detail.notification.id!)
}

export async function setupNotifications() {
  const permissionResponse = await notifee.requestPermission()

  if (
    permissionResponse.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    permissionResponse.authorizationStatus === AuthorizationStatus.PROVISIONAL
  ) {
    notifee.setNotificationCategories(iosCategories)
    notifee.createChannels(androidChannels)
    notifee.getNotificationSettings().then(settings => {
      if (settings.android.alarm !== AndroidNotificationSetting.ENABLED) {
        notifee.openAlarmPermissionSettings()
      }
    })
  }

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    switch (type) {
      case EventType.PRESS:
        handleNotificationPress(detail)
        break
      case EventType.ACTION_PRESS:
        await handleNotificationActionPress(detail)
        break
      default:
        break
    }
  })
}

export async function displayLocalNotification(
  notification: Notification,
): Promise<string> {
  return notifee.displayNotification(notification)
}

export async function scheduleLocalNotification(
  notification: Notification,
  delayMs: number,
): Promise<string> {
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: Date.now() + delayMs,
  }

  return notifee.createTriggerNotification(notification, trigger)
}

export async function cancelScheduledNotifications() {
  const notificationIds = await notifee.getTriggerNotificationIds()
  return notifee.cancelTriggerNotifications(notificationIds)
}

export function useNotificationEvents() {
  const appState = useAppState()
  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.PRESS:
          handleNotificationPress(detail, navigation.navigate)
          break
        default:
          break
      }
    })

    return unsubscribe
  }, [navigation])

  useEffect(() => {
    if (Platform.OS === 'android') {
      notifee.getInitialNotification().then(n => {
        if (n) {
          handleNotificationPress(n, navigation.navigate)
        }
      })
    }
  }, [navigation])

  useEffect(() => {
    if (appState === 'active') {
      while (navigationQueue.length > 0) {
        const { name, params } = navigationQueue[0]
        // @ts-expect-error -- The navigationQueue is difficult to type.
        navigation.navigate(name, params)
        navigationQueue.shift()
      }
    }
  }, [navigation, appState])
}
