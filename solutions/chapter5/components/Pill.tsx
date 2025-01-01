import React from 'react'
import type { TextStyle, ViewStyle } from 'react-native'
import { View } from 'react-native'

import { colors, sizes } from '../../../shared/theme'
import { Text } from './Text'

interface PillProps {
  text: string
}

export const Pill = (props: PillProps) => {
  return (
    <View style={$pill}>
      <Text preset="label1" text={props.text} style={$text} />
    </View>
  )
}

const $pill: ViewStyle = {
  alignItems: 'center',
  alignSelf: 'flex-start',
  backgroundColor: colors.background.accent,
  borderColor: colors.border.base,
  borderRadius: sizes.radius.md,
  borderWidth: sizes.border.sm,
  height: sizes.spacing.xl,
  justifyContent: 'center',
  paddingHorizontal: sizes.spacing.md,
}

const $text: TextStyle = {
  color: colors.text.brand,
}
