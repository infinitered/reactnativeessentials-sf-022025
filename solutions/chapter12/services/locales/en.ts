const en = {
  common: {
    theresNothingHere: "There's\nNothing Here...",
    close: 'Close',
  },
  gamesListScreen: {
    showFavorites: 'Show Favorites',
    showFavoritesA11yLabel: 'Show Only Favorites',
    retroGames: 'Retro Games',
    rating: 'Rating<Ratings />:',
    ratings: ' ({{count}} ratings)',
    ratingA11yLabel: '{{rating}} stars',
  },
  reviewScreen: {
    writeAReview: 'Write a Review',
    typeYourReview: 'Type your review...',
    submitReview: 'Submit Review',
    reviews: 'Reviews: <Stars />',
  },
  gameDetailsScreen: {
    addToFavorites: 'Add to Favorites',
    loadingPleaseWait: 'Loading\nPlease Wait...',
    released: 'Released:',
    releasedDate: 'Released: <date>{{releaseDate, datetime}}</date>',
    genre: 'Genre:',
    studio: 'Studio:',
  },
}

export default en
export type Translations = typeof en
