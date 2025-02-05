import './services/i18n'

import React from 'react'
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { AppNavigator } from './navigators/AppNavigator'
import { persistor, store } from './services/redux/store'
import { useThemeProvider } from './services/theme'

const App = (): React.JSX.Element | null => {
  const { themeScheme, ThemeProvider } = useThemeProvider()

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <ThemeProvider value={{ themeScheme }}>
            <AppNavigator />
          </ThemeProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
