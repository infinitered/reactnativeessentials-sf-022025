import React from 'react'
import type { TextStyle, ViewStyle } from 'react-native'
import { View } from 'react-native'

import { colors, sizes } from '../../../shared/theme'
import { Icon } from './Icon'
import { Text } from './Text'

interface RatingProps {
  rating: number
  ratingsCount?: number
}

export const Rating = ({ rating, ratingsCount }: RatingProps) => {
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
