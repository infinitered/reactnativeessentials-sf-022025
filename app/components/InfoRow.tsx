import React, { FC } from 'react'
import { TextStyle, View, ViewStyle } from 'react-native'

import { sizes } from '../../shared/theme'
import { isRTL } from '../services/i18n'
import { Text } from './Text'

interface InfoRowProps {
  valueTx?: string
  valueText?: string
  labelTx?: string
  labelText?: string
}

export const InfoRow: FC<InfoRowProps> = ({
  valueText,
  valueTx,
  labelText,
  labelTx,
}) => (
  <View accessible style={$informationRow}>
    <Text preset="label2" tx={labelTx} text={labelText} />
    <Text
      preset="title2"
      tx={valueTx}
      text={valueText}
      style={$informationValue}
    />
  </View>
)

const $informationRow: ViewStyle = {
  flexDirection: isRTL ? 'row-reverse' : 'row',
  alignItems: 'flex-start',
  columnGap: sizes.spacing.xs,
}

const $informationValue: TextStyle = {
  flex: 1,
  top: -2,
  textAlign: isRTL ? 'right' : 'left',
}
