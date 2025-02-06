import React from 'react'
import type { TextStyle, ViewStyle } from 'react-native'
import { View } from 'react-native'

import { sizes } from '../../shared/theme'
import { isRTL } from '../services/i18n'
import type { ThemedStyle } from '../services/theme'
import { useAppTheme } from '../services/theme'
import { Text } from './Text'

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
  alignSelf: isRTL ? 'flex-end' : 'flex-start',
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
