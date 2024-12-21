import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { SectionList, View } from 'react-native'
import type { ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { api } from '../../../shared/services/api'
import type { Game } from '../../../shared/services/types'
import { sizes } from '../../../shared/theme'
import { Card } from '../components/Card'
import { Empty } from '../components/Empty'
import { Pill } from '../components/Pill'
import { Switch } from '../components/Switch'
import { Text } from '../components/Text'
import { useGlobalState } from '../services/state'
import { useAppTheme } from '../services/theme'
import type { ThemedStyle } from '../services/theme'

function useGameData() {
  const { favorites, games, setGames } = useGlobalState()
  const [filterFavorites, setFilterFavorites] = useState(false)

  const getGames = useCallback(async () => {
    const response = await api.getGames()

    if (response.ok) {
      setGames(response.data)
    }
  }, [setGames])

  useEffect(() => {
    getGames()
  }, [getGames])

  const gamesSectionList = useMemo(() => {
    const initialValue: { [k: number]: Game[] } = {}
    const gameListMap = games.reduce((acc, curr) => {
      if (filterFavorites && !favorites.includes(curr.id)) return acc

      const year = curr.releaseDate.y
      if (acc[year]) {
        acc[year].push(curr)
      } else {
        acc[year] = [curr]
      }
      return acc
    }, initialValue)

    return Object.entries(gameListMap).map(([k, v]) => ({
      year: k,
      key: k,
      data: v,
    }))
  }, [games, favorites, filterFavorites])

  return { gamesSectionList, filterFavorites, setFilterFavorites }
}

export const GamesListScreen = () => {
  const { bottom: paddingBottom } = useSafeAreaInsets()
  const navigation = useNavigation()
  const {
    gamesSectionList: games,
    filterFavorites,
    setFilterFavorites,
  } = useGameData()
  const { themed } = useAppTheme()

  return (
    <>
      <View style={themed($favoritesFilter)}>
        <Text preset="title1" text="Show Favorites" />
        <Switch
          on={filterFavorites}
          onToggle={() => setFilterFavorites(!filterFavorites)}
        />
      </View>
      <SectionList
        sections={games}
        style={themed($list)}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={[{ paddingBottom }, $contentContainer]}
        ListEmptyComponent={<Empty />}
        initialNumToRender={6}
        maxToRenderPerBatch={20}
        windowSize={31}
        renderItem={({ item }) => (
          <Card
            onPress={() => {
              navigation.navigate('GameDetails', {
                gameId: item.id,
                name: item.name,
              })
            }}
            name={item.name}
            rating={item.totalRatingStars}
            releaseDate={item.releaseDate.human}
            imageUrl={item.cover.imageUrl}
          />
        )}
        renderSectionHeader={({ section: { year } }) => <Pill text={year} />}
      />
    </>
  )
}

const $list: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background.primary,
})

const $contentContainer: ViewStyle = {
  rowGap: sizes.spacing.lg,
  padding: sizes.spacing.md,
}

const $favoritesFilter: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: sizes.spacing.md,
  borderBottomColor: colors.border.base,
  borderBottomWidth: 2,
  backgroundColor: colors.background.secondary,
})
