import React from 'react'
import type { ViewStyle } from 'react-native'
import { View } from 'react-native'

import { colors } from '../../../shared/theme'
import { Text } from '../components/Text'
import type { ScreenProps } from '../navigators/AppNavigator'

export const GameDetailsScreen = ({ route }: ScreenProps<'GameDetails'>) => {
  const gameId = route.params.gameId

  return (
    <View style={$view}>
      <Text preset="headline1" text={`Game Id: ${gameId}`} />
    </View>
  )
}

const $view: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background.primary,
}
