import type { PostGamesParams } from '../../shared/services/types'
import rawData from '../mocks/games.json'
import { camelCaseKeys } from './camelCaseKeys'

const transformedData = rawData.map(g => {
  let game = g as Record<string, any>

  game.totalRatingStars = Math.round((g.total_rating / 100) * 5)
  game.cover.imageUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${g.cover.image_id}.jpg`

  g.screenshots.forEach((s, i) => {
    game.screenshots[i].imageUrl =
      `https://images.igdb.com/igdb/image/upload/t_screenshot_huge/${s.image_id}.jpg`
  })

  game.releaseDate = g.release_dates
    .filter(r => typeof r.y === 'number' && r.y > 0)
    .sort((a, b) => a.date! - b.date!)[0]

  return game
})

export const gameData = camelCaseKeys(transformedData)

export function sortGames(
  data: typeof gameData,
  opts: Required<PostGamesParams>,
) {
  const { sortBy, sortOrder } = opts

  return data.sort((a, b) => {
    const order = sortOrder === 'asc' ? [a, b] : [b, a]

    if (sortBy === 'name') {
      return order[0][sortBy].localeCompare(order[1][sortBy])
    }

    if (sortBy === 'releaseDate') {
      return order[0][sortBy].date - order[1][sortBy].date
    }

    return order[0][sortBy] - order[1][sortBy]
  })
}

export function sliceGames(
  data: typeof gameData,
  opts: Required<PostGamesParams>,
) {
  const { limit, offset } = opts

  return data.slice(offset, offset + limit)
}

export function findGameById(id: number) {
  return gameData.find(g => g.id === id)
}
