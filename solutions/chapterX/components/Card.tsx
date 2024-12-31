import React from 'react'
import { Trans } from 'react-i18next'
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native'
import { Image, Pressable, View } from 'react-native'

import { sizes } from '../../../shared/theme'
import { epochToFormattedDate, isRTL } from '../services/i18n'
import type { ThemedStyle } from '../services/theme'
import { useAppTheme } from '../services/theme'
import { Rating } from './Rating'
import { Text } from './Text'

interface CardProps {
  name: string
  imageUrl: string
  releaseDate: number
  rating: number
  onPress: () => void
}

export const Card = (props: CardProps) => {
  const { name, imageUrl, releaseDate, rating = 0, onPress } = props
  const { themed } = useAppTheme()
  return (
    <Pressable onPress={onPress}>
      <View style={themed($reflection)} />
      <View style={themed($card)}>
        <Image source={{ uri: imageUrl }} style={themed($image)} />
        <View style={$contentWrapper}>
          <Text
            numberOfLines={1}
            preset="headline2"
            text={name}
            style={$name}
          />

          <View style={$contentRow}>
            <Text preset="label2">
              <Trans
                ns="gameDetailsScreen"
                i18nKey="releasedDate"
                components={{
                  date: <Text preset="title2" />,
                }}
                values={{
                  releaseDate: epochToFormattedDate(releaseDate),
                }}
              />
            </Text>
          </View>

          <Rating rating={rating} />
        </View>
      </View>
    </Pressable>
  )
}

const $card: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background.brand,
  borderColor: colors.border.base,
  borderRadius: sizes.radius.md,
  borderWidth: sizes.border.sm,
  flexDirection: isRTL ? 'row-reverse' : 'row',
  padding: sizes.spacing.md,
  columnGap: sizes.spacing.md,
})

const $reflection: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background.reflection,
  borderRadius: sizes.radius.md,
  bottom: -6,
  height: '100%',
  position: 'absolute',
  right: -6,
  width: '100%',
})

const $contentWrapper: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  rowGap: sizes.spacing.xs,
}

const $image: ThemedStyle<ImageStyle> = ({ colors }) => ({
  borderColor: colors.border.base,
  borderRadius: sizes.radius.sm,
  borderWidth: sizes.border.sm,
  height: 120,
  width: 90,
})

const $contentRow: ViewStyle = {
  flexDirection: isRTL ? 'row-reverse' : 'row',
  columnGap: sizes.spacing.xs,
  alignItems: 'center',
}

const $name: TextStyle = {
  textAlign: isRTL ? 'right' : 'left',
}
