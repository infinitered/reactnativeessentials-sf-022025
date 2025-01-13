/**
 * @format
 */
import 'react-native-gesture-handler'

import React, { useEffect } from 'react'
import { AppRegistry } from 'react-native'
import BootSplash from 'react-native-bootsplash'

import { name as appName } from './app.json'
import { setupMockServer } from './msw'
import {
  setupTrainingAppModeSelector,
  TrainingBanner,
} from './shared/utils/trainingHelper'

const activeAppMode = setupTrainingAppModeSelector()

setupMockServer()

if (__DEV__) {
  import('./shared/utils/reactotronConfig').then(() =>
    console.log('Reactotron Configured'),
  )
}

const appFileRegistry = {
  assignment: () => require('./app/App').default,
  chapter1: () => require('./solutions/chapter1/App').default,
  chapter2: () => require('./solutions/chapter2/App').default,
  chapter3: () => require('./solutions/chapter3/App').default,
  chapter4: () => require('./solutions/chapter4/App').default,
  chapter5: () => require('./solutions/chapter5/App').default,
  chapter6: () => require('./solutions/chapter6/App').default,
  chapter7: () => require('./solutions/chapter7/App').default,
  chapter8: () => require('./solutions/chapter8/App').default,
  chapter9: () => require('./solutions/chapter9/App').default,
  chapter10: () => require('./solutions/chapter10/App').default,
  chapter11: () => require('./solutions/chapter11/App').default,
}

const AppMode = appFileRegistry[activeAppMode]()

function App() {
  useEffect(() => {
    setTimeout(() => {
      BootSplash.hide({ fade: true })
    }, 500)
  }, [])

  return (
    <>
      <AppMode />
      <TrainingBanner appMode={activeAppMode} />
    </>
  )
}

AppRegistry.registerComponent(appName, () => App)
