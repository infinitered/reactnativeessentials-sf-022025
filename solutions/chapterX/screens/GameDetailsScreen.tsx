import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native'
import { Image, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { api } from '../../../shared/services/api'
import type { Game, Reviews } from '../../../shared/services/types'
import { colors, sizes } from '../../../shared/theme'
import { Button } from '../components/Button'
import { Empty } from '../components/Empty'
import { Rating } from '../components/Rating'
import { Switch } from '../components/Switch'
import { Text } from '../components/Text'
import type { ScreenProps } from '../navigators/AppNavigator'
import {
  displayLocalNotification,
  NotificationChannel,
  NotificationType,
} from '../services/notifications'
import { useGlobalState } from '../services/state'

interface ReviewsProps {
  gameId: number
  reviews: Reviews[keyof Reviews]
}

export const GameDetailsScreen = ({ route }: ScreenProps<'GameDetails'>) => {
  const { bottom: paddingBottom } = useSafeAreaInsets()
  const gameId = route.params.gameId
  const state = useGlobalState()
  const reviews = gameId ? (state.reviews[gameId] ?? []) : []

  const { favorites, toggleFavorite } = useGlobalState()
  const [game, setGame] = useState<Game | undefined>()

  const getGame = useCallback(async () => {
    const response = await api.getGame(gameId)

    if (response.ok) {
      setGame(response.data)
    }
  }, [setGame, gameId])

  function notifyForReview(isFavorite: boolean) {
    if (!game) return
    if (!isFavorite) return
    if (reviews.length > 0) return

    displayLocalNotification({
      title: `Please Review: ${game.name}`,
      body: 'Looks like you enjoyed this game! Please leave a review!',
      data: {
        notificationType: NotificationType.GameReview,
        gameId: game.id,
        gameName: game.name,
      },
      android: {
        channelId: NotificationChannel.Default,
        color: colors.text.accent,
        smallIcon: 'ic_notification_default',
        pressAction: { id: 'default' },
      },
    })
  }

  useEffect(() => {
    getGame()
  }, [getGame])

  const {
    id,
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

  const isFavorite = Boolean(
    favorites.find(favoriteGameId => favoriteGameId === id),
  )

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
      {!!id && (
        <View style={$favoriteWrapper}>
          <Text
            style={$favoriteLabel}
            preset="title1"
            text="Add to Favorites"
          />
          <Switch
            on={isFavorite}
            onToggle={() => {
              toggleFavorite(id)
              notifyForReview(!isFavorite)
            }}
          />
        </View>
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

      <Reviews gameId={gameId} reviews={reviews} />
    </ScrollView>
  )
}

const Reviews = ({ gameId, reviews }: ReviewsProps) => {
  const navigation = useNavigation()

  return (
    <>
      <View style={$reviewsHeaderWrapper}>
        <Text preset="label2">
          Reviews: <Text preset="title2" text={reviews.length.toString()} />
        </Text>
        <Button
          text="Write A Review"
          onPress={() => navigation.navigate('Review', { gameId })}
        />
      </View>

      {reviews.map((review, index) => (
        <View key={index} style={$reviewWrapper}>
          <Text text={review} />
        </View>
      ))}
    </>
  )
}

const $scrollView: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background.secondary,
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

const $favoriteWrapper: ViewStyle = {
  position: 'absolute',
  right: sizes.spacing.md,
  top: sizes.spacing.md,
  flexDirection: 'row',
  alignItems: 'center',
  gap: sizes.spacing.xs,
}

const $favoriteLabel: TextStyle = {
  color: colors.text.overlay,
  textShadowColor: colors.manipulators.changeHexAlpha(colors.text.base, 40),
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 1,
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

const $reviewsHeaderWrapper: ViewStyle = {
  padding: sizes.spacing.md,
  rowGap: sizes.spacing.md,
  borderColor: colors.border.base,
  borderTopWidth: sizes.border.sm,
}

const $reviewWrapper: ViewStyle = {
  borderColor: colors.border.base,
  borderTopWidth: sizes.border.sm,
  padding: sizes.spacing.md,
}
