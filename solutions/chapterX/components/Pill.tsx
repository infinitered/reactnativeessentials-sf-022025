import React from 'react'
import { View } from 'react-native'
import type { TextStyle, ViewStyle } from 'react-native'

import { sizes } from '../../../shared/theme'
import { Text } from './Text'
import { useAppTheme } from '../services/theme'
import type { ThemedStyle } from '../services/theme'

interface PillProps {
  text: string
}

export const Pill = (props: PillProps) => {
  const { themed } = useAppTheme()
  return (
    <View style={themed($pill)}>
      <Text preset="label1" text={props.text} style={themed($text)} />
    </View>
  )
}

const $pill: ThemedStyle<ViewStyle> = ({ colors }) => ({
  alignItems: 'center',
  alignSelf: 'flex-start',
  backgroundColor: colors.background.accent,
  borderColor: colors.border.base,
  borderRadius: sizes.radius.md,
  borderWidth: sizes.border.sm,
  height: sizes.spacing.xl,
  justifyContent: 'center',
  paddingHorizontal: sizes.spacing.md,
})

const $text: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text.brand,
})
