import type { ParseKeys, TOptions } from 'i18next'
import { t } from 'i18next'
import React from 'react'
import type {
  StyleProp,
  TextProps as RNTextProps,
  TextStyle,
} from 'react-native'
import { Text as RNText } from 'react-native'

import { fonts } from '../../shared/theme'
import { isRTL } from '../services/i18n'
import type { ThemedStyle } from '../services/theme'
import { useAppTheme } from '../services/theme'

export interface TextProps extends RNTextProps {
  /**
   * One of the different types of text presets.
   */
  preset?: keyof typeof $presets
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string
  /**
   * Text which is looked up via i18n.
   */
  tx?: ParseKeys
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: TOptions
}

export const Text = (props: TextProps) => {
  const {
    tx,
    txOptions,
    text,
    children,
    preset = 'body',
    style: $styleOverride,
    ...RestTextProps
  } = props
  const { themed } = useAppTheme()

  const i18nText = tx && t(tx, txOptions)
  const content = i18nText ?? text ?? children

  const $textStyle = [$base, $presets[preset], $styleOverride, $rtl]

  return (
    <RNText {...RestTextProps} style={themed($textStyle)}>
      {content}
    </RNText>
  )
}

const $base: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text.base,
})

const $presets = {
  display: { fontSize: 36, lineHeight: 44, fontFamily: fonts.primary.regular },
  headline1: {
    fontSize: 28,
    lineHeight: 36,
    fontFamily: fonts.primary.semiBold,
  },
  headline2: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: fonts.primary.semiBold,
  },
  title1: { fontSize: 16, lineHeight: 24, fontFamily: fonts.primary.medium },
  title2: { fontSize: 14, lineHeight: 20, fontFamily: fonts.primary.medium },
  label1: { fontSize: 14, lineHeight: 20, fontFamily: fonts.primary.bold },
  label2: { fontSize: 12, lineHeight: 16, fontFamily: fonts.primary.bold },
  body: { fontSize: 14, lineHeight: 20, fontFamily: fonts.primary.regular },
} satisfies Record<string, StyleProp<TextStyle>>

const $rtl: TextStyle = { writingDirection: isRTL ? 'rtl' : 'ltr' }
