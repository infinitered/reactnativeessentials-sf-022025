import React from 'react'
import type { TextStyle, ViewStyle } from 'react-native'
import { View } from 'react-native'

import { colors, sizes } from '../../../shared/theme'
import type { IconProps } from './Icon'
import { Icon } from './Icon'
import { Text } from './Text'

export const Empty = (props: { text?: string; icon?: IconProps['name'] }) => {
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
        style={$emptyText}
      />
    </View>
  )
}

const $emptyContentWrapper: ViewStyle = {
  flexDirection: 'row',
  paddingVertical: sizes.spacing.xl,
}

const $emptyText: TextStyle = {
  color: colors.text.baseMuted,
  marginStart: sizes.spacing.md,
}
