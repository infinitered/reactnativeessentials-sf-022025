export interface PostGamesParams {
  sortBy?: Extract<
    keyof Game,
    'id' | 'totalRatingStars' | 'name' | 'releaseDate'
  >
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export interface Game {
  id: number
  cover: GameCover
  genres: GameGenre[]
  involvedCompanies: GameInvolvedCompany[]
  name: string
  releaseDate: GameReleaseDate
  screenshots: GameCover[]
  summary: string
  totalRating: number
  totalRatingCount: number
  totalRatingStars: number
}

export interface GameCover {
  id: number
  imageId: string
  imageUrl: string
}

export interface GameGenre {
  id: number
  name: string
}

export interface GameInvolvedCompany {
  id: number
  company: GameGenre
  developer: boolean
  publisher: boolean
}

export interface GameReleaseDate {
  id: number
  date: number
  human: string
  y: number
}

export type SetGames = (games: Array<Game>) => void

export type Favorites = Array<Game['id']>

export type ToggleFavorite =
  | ((gameId: Game['id']) => void)
  | ((gameId: Game['id'], value?: boolean) => void)

export type Reviews = Record<Game['id'], Array<string>>

export type AppendReview = (gameId: Game['id'], review: string) => void

export interface GlobalStateContextData {
  games: Array<Game>
  setGames: SetGames
  favorites: Favorites
  toggleFavorite: ToggleFavorite
  reviews: Reviews
  appendReview: AppendReview
}
