import React from 'react'
import { useTranslation } from 'react-i18next'
import type { TextStyle, ViewStyle } from 'react-native'
import { View } from 'react-native'

import { sizes } from '../../../shared/theme'
import { isRTL } from '../services/i18n'
import type { ThemedStyle } from '../services/theme'
import { useAppTheme } from '../services/theme'
import type { IconProps } from './Icon'
import { Icon } from './Icon'
import { Text, TextProps } from './Text'

export const Empty = (props: {
  tx?: TextProps['tx']
  icon?: IconProps['name']
}) => {
  const {
    theme: { colors },
    themed,
  } = useAppTheme()
  const { t } = useTranslation()
  return (
    <View style={$emptyContentWrapper}>
      <Icon
        color={colors.tint.baseMuted}
        size={36}
        name={props.icon ?? 'frown'}
      />
      <Text
        preset="display"
        tx={props.tx ?? t('common:theresNothingHere')}
        style={themed($emptyText)}
      />
    </View>
  )
}

const $emptyContentWrapper: ViewStyle = {
  flexDirection: isRTL ? 'row-reverse' : 'row',
  paddingVertical: sizes.spacing.xl,
}

const $emptyText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text.baseMuted,
  marginStart: sizes.spacing.md,
})
