import React from 'react'
import type { ViewStyle } from 'react-native'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors, sizes } from '../../../shared/theme'
import { games } from '../../../shared/utils/sampleGames'
import { Card } from '../components/Card'

export const GamesListScreen = () => {
  const { bottom: paddingBottom, top: paddingTop } = useSafeAreaInsets()

  return (
    <ScrollView
      contentContainerStyle={[{ paddingBottom, paddingTop }, $contentContainer]}
      style={$list}>
      {games.map(({ id, name, totalRatingStars, releaseDate, cover }) => (
        <Card
          key={id}
          name={name}
          rating={totalRatingStars}
          releaseDate={releaseDate.human}
          imageUrl={cover.imageUrl}
        />
      ))}
    </ScrollView>
  )
}

const $list: ViewStyle = {
  backgroundColor: colors.background.primary,
}

const $contentContainer: ViewStyle = {
  flex: 1,
  rowGap: sizes.spacing.lg,
  padding: sizes.spacing.md,
}
