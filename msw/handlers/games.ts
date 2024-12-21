import { rest } from 'msw'

import type { PostGamesParams } from '../../shared/services/types'
import { gameData, sliceGames, sortGames } from '../utils/prepareGameData'

export const games = rest.post(
  'https://api.retrogames.dev/games',
  async (req, res, ctx) => {
    const body = await req.json()

    const opts: Required<PostGamesParams> = {
      sortBy: 'releaseDate',
      sortOrder: 'asc',
      limit: 100,
      offset: 0,
      ...(body as object),
    }

    const sorted = sortGames(gameData, opts)
    const sliced = sliceGames(sorted, opts)

    return res(ctx.status(200), ctx.json(sliced))
  },
)
