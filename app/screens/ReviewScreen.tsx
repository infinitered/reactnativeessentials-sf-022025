import React from 'react'
import type { TextStyle, ViewStyle } from 'react-native'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors, sizes } from '../../shared/theme'
import { Text } from '../components/Text'

export const ReviewScreen = () => {
  const { bottom: paddingBottom, top: paddingTop } = useSafeAreaInsets()

  return (
    <View style={[$screen, { paddingBottom, paddingTop }]}>
      <View style={$welcomeContainer}>
        <Text style={$welcomeSmall}>Welcome To:</Text>
        <Text style={$welcomeLarge}>React Native{`\n`}Essentials!</Text>
      </View>
      <Text style={$screenInfo}>./app/screens/ReviewScreen.tsx</Text>
    </View>
  )
}

const $screen: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background.primary,
  paddingHorizontal: sizes.spacing.md,
  justifyContent: 'space-between',
}

const $welcomeContainer: ViewStyle = {
  rowGap: sizes.spacing.lg,
  flexGrow: 1,
  justifyContent: 'center',
}

const $welcomeSmall: TextStyle = {
  fontSize: 18,
  color: 'black',
}

const $welcomeLarge: TextStyle = {
  fontSize: 48,
  color: 'black',
}

const $screenInfo: TextStyle = {
  fontSize: 12,
  opacity: 0.5,
  color: 'black',
}
