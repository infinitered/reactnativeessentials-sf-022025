import React from 'react'
import type { ImageStyle, ViewStyle } from 'react-native'
import { Image, Pressable, View } from 'react-native'

import { colors, sizes } from '../../../shared/theme'
import { Rating } from './Rating'
import { Text } from './Text'

interface CardProps {
  name: string
  imageUrl: string
  releaseDate: string
  rating: number
  onPress: () => void
}

export const Card = (props: CardProps) => {
  const { name, imageUrl, releaseDate, rating = 0, onPress } = props

  return (
    <Pressable onPress={onPress}>
      <View style={$reflection} />
      <View style={$card}>
        <Image source={{ uri: imageUrl }} style={$image} />
        <View style={$contentWrapper}>
          <Text numberOfLines={1} preset="headline2" text={name} />

          <View style={$contentRow}>
            <Text preset="label2" text="Released:" />
            <Text preset="title2" text={releaseDate} />
          </View>

          <Rating rating={rating} />
        </View>
      </View>
    </Pressable>
  )
}

const $card: ViewStyle = {
  backgroundColor: colors.background.brand,
  borderColor: colors.border.base,
  borderRadius: sizes.radius.md,
  borderWidth: sizes.border.sm,
  flexDirection: 'row',
  padding: sizes.spacing.md,
  columnGap: sizes.spacing.md,
}

const $reflection: ViewStyle = {
  backgroundColor: colors.background.reflection,
  borderRadius: sizes.radius.md,
  bottom: -6,
  height: '100%',
  position: 'absolute',
  right: -6,
  width: '100%',
}

const $contentWrapper: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  rowGap: sizes.spacing.xs,
}

const $image: ImageStyle = {
  borderColor: colors.border.base,
  borderRadius: sizes.radius.sm,
  borderWidth: sizes.border.sm,
  height: 120,
  width: 90,
}

const $contentRow: ViewStyle = {
  flexDirection: 'row',
  columnGap: sizes.spacing.xs,
  alignItems: 'center',
}
