import React from 'react'
import type { TextStyle, ViewStyle } from 'react-native'
import { View } from 'react-native'

import { sizes } from '../../../shared/theme'
import type { ThemedStyle } from '../services/theme'
import { useAppTheme } from '../services/theme'
import type { IconProps } from './Icon'
import { Icon } from './Icon'
import { Text } from './Text'

export const Empty = (props: { text?: string; icon?: IconProps['name'] }) => {
  const {
    theme: { colors },
    themed,
  } = useAppTheme()
  return (
    <View style={$emptyContentWrapper}>
      <Icon
        color={colors.tint.baseMuted}
        size={36}
        name={props.icon ?? 'frown'}
      />
      <Text
        preset="display"
        text={props.text ?? "There's\nNothing Here..."}
        style={themed($emptyText)}
      />
    </View>
  )
}

const $emptyContentWrapper: ViewStyle = {
  flexDirection: 'row',
  paddingVertical: sizes.spacing.xl,
}

const $emptyText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text.baseMuted,
  marginStart: sizes.spacing.md,
})
