import './services/i18n'

import React from 'react'
import type { ViewStyle } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context'

import { AppNavigator } from './navigators/AppNavigator'
import { setupNotifications } from './services/notifications'
import { GlobalStateProvider } from './services/state'
import { useThemeProvider } from './services/theme'

setupNotifications()

const App = (): React.JSX.Element | null => {
  const { themeScheme, ThemeProvider } = useThemeProvider()

  return (
    <GestureHandlerRootView style={$gestureHandler}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <GlobalStateProvider>
          <ThemeProvider value={{ themeScheme }}>
            <AppNavigator />
          </ThemeProvider>
        </GlobalStateProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default App

const $gestureHandler: ViewStyle = { flex: 1 }
