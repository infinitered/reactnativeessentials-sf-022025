import React, { useCallback, useEffect, useState } from 'react'
import { Image, ScrollView, View } from 'react-native'
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { api } from '../../../shared/services/api'
import type { Game } from '../../../shared/services/types'
import { colors, sizes } from '../../../shared/theme'
import { Empty } from '../components/Empty'
import { Rating } from '../components/Rating'
import { Text } from '../components/Text'
import type { ScreenProps } from '../navigators/AppNavigator'

export const GameDetailsScreen = ({ route }: ScreenProps<'GameDetails'>) => {
  const { bottom: paddingBottom } = useSafeAreaInsets()
  const gameId = route.params.gameId

  const [game, setGame] = useState<Game | undefined>()

  const getGame = useCallback(async () => {
    const response = await api.getGame(gameId)

    if (response.ok) {
      setGame(response.data)
    }
  }, [setGame, gameId])

  useEffect(() => {
    getGame()
  }, [getGame])

  const {
    cover,
    name,
    releaseDate,
    genres,
    screenshots,
    involvedCompanies,
    totalRatingStars,
    totalRatingCount,
    summary,
  } = game ?? {}

  return (
    <ScrollView
      style={$scrollView}
      contentContainerStyle={[$contentContainer, { paddingBottom }]}>
      {screenshots ? (
        <Image
          blurRadius={10}
          source={{ uri: screenshots[0]?.imageUrl }}
          style={$imageBackground}
        />
      ) : (
        <View style={$imageBackground} />
      )}
      <View style={$bodyWrapper}>
        <View style={$headerWrapper}>
          {cover ? (
            <Image
              resizeMode="cover"
              source={{ uri: cover?.imageUrl }}
              style={$image}
            />
          ) : (
            <View style={$image} />
          )}

          <Text preset="headline1" text={name} />
        </View>

        {!game ? (
          <Empty text={'Loading\nPlease Wait...'} icon="loader" />
        ) : (
          <>
            <View style={$informationWrapper}>
              <View style={$informationRow}>
                <Text preset="label2" text="Released:" />
                <Text
                  preset="title2"
                  text={releaseDate?.human}
                  style={$informationValue}
                />
              </View>
              <View style={$informationRow}>
                <Text preset="label2" text="Genre:" />
                <Text
                  preset="title2"
                  text={genres?.map(g => g.name).join(', ')}
                  style={$informationValue}
                />
              </View>
              <View style={$informationRow}>
                <Text preset="label2" text="Studio:" />
                <Text
                  preset="title2"
                  text={involvedCompanies?.map(c => c.company.name).join(', ')}
                  style={$informationValue}
                />
              </View>
              {!!totalRatingStars && (
                <Rating
                  ratingsCount={totalRatingCount}
                  rating={totalRatingStars}
                />
              )}
            </View>

            <View style={$descriptionWrapper}>
              <Text text={summary} />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  )
}

const $scrollView: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background.primary,
}

const $contentContainer: ViewStyle = {
  flexGrow: 1,
}

const $bodyWrapper: ViewStyle = {
  backgroundColor: colors.background.primary,
  paddingHorizontal: sizes.spacing.md,
  flexGrow: 1,
}

const $informationWrapper: ViewStyle = {
  paddingVertical: sizes.spacing.md,
  rowGap: sizes.spacing.xs,
}

const $informationRow: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'flex-start',
  columnGap: sizes.spacing.xs,
}

const $informationValue: TextStyle = {
  flex: 1,
  top: -2,
}

const $descriptionWrapper: ViewStyle = {
  paddingVertical: sizes.spacing.md,
}

const $imageBackground: ImageStyle = {
  height: 175,
  width: '100%',
  backgroundColor: colors.background.secondary,
  borderColor: colors.border.base,
  borderBottomWidth: sizes.border.sm,
}

const $image: ImageStyle = {
  borderColor: colors.border.base,
  borderRadius: sizes.radius.sm,
  borderWidth: sizes.border.sm,
  height: 153,
  marginEnd: sizes.spacing.md,
  width: 115,
  backgroundColor: colors.background.secondary,
  position: 'absolute',
  bottom: 0,
}

const $headerWrapper: ViewStyle = {
  alignItems: 'center',
  flexDirection: 'row',
  paddingVertical: sizes.spacing.md,
  paddingLeft: ($image.width as number) + sizes.spacing.md,
  minHeight: 104,
}
