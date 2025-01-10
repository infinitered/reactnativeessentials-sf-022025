import React from 'react'
import type { TextStyle, ViewStyle } from 'react-native'
import { View } from 'react-native'

import { sizes } from '../../../shared/theme'
import { isRTL, Trans, useTranslation } from '../services/i18n'
import { useAppTheme } from '../services/theme'
import { Icon } from './Icon'
import { Text } from './Text'

interface RatingProps {
  rating: number
  ratingsCount?: number
}

export const Rating = ({ rating, ratingsCount }: RatingProps) => {
  const {
    theme: { colors },
  } = useAppTheme()
  const { t } = useTranslation()

  return (
    <View accessible style={$container}>
      <Text style={$label} preset="label2">
        <Trans
          i18nKey="gamesListScreen:rating"
          components={{
            Ratings:
              ratingsCount !== undefined ? (
                <Text
                  preset="label2"
                  tx="gamesListScreen:ratings"
                  txOptions={{ count: ratingsCount }}
                />
              ) : (
                <></>
              ),
          }}
        />
      </Text>
      <View
        style={$starContainer}
        accessible
        accessibilityLabel={t('gamesListScreen:ratingA11yLabel', { rating })}>
        {Array.from({ length: rating }).map((_, i) => (
          <Icon color={colors.tint.accent} key={i} name="star" />
        ))}
      </View>
    </View>
  )
}

const $container: ViewStyle = {
  flexDirection: isRTL ? 'row-reverse' : 'row',
  columnGap: sizes.spacing.xs,
  alignItems: 'center',
}

const $starContainer: ViewStyle = {
  flexDirection: isRTL ? 'row-reverse' : 'row',
}

const $label: TextStyle = {
  bottom: -2,
  minHeight: 24,
  height: 24,
}
