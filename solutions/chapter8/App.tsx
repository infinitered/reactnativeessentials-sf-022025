import React from 'react'
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context'

import { AppNavigator } from './navigators/AppNavigator'
import { GlobalStateProvider } from './services/state'
import { useThemeProvider } from './services/theme'

const App = (): React.JSX.Element | null => {
  const { themeScheme, ThemeProvider } = useThemeProvider()

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GlobalStateProvider>
        <ThemeProvider value={{ themeScheme }}>
          <AppNavigator />
        </ThemeProvider>
      </GlobalStateProvider>
    </SafeAreaProvider>
  )
}

export default App
