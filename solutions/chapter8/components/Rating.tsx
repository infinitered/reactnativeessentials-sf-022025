import React from 'react'
import { View } from 'react-native'
import type { TextStyle, ViewStyle } from 'react-native'

import { sizes } from '../../../shared/theme'
import { Icon } from './Icon'
import { Text } from './Text'
import { useAppTheme } from '../services/theme'

interface RatingProps {
  rating: number
  ratingsCount?: number
}

export const Rating = ({ rating, ratingsCount }: RatingProps) => {
  const { theme: { colors } } = useAppTheme()
  const label = [
    'Rating',
    ratingsCount !== undefined && `(${ratingsCount} ratings)`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <View style={$container}>
      <Text style={$label} preset="label2" text={`${label}:`} />
      {Array.from({ length: rating }).map((_, i) => (
        <Icon color={colors.tint.accent} key={i} name="star" />
      ))}
    </View>
  )
}

const $container: ViewStyle = {
  flexDirection: 'row',
  columnGap: sizes.spacing.xs,
  alignItems: 'center',
}

const $label: TextStyle = {
  bottom: -2,
}
