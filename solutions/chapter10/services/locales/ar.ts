import type { Translations } from './en'

const ar: Translations = {
  common: {
    theresNothingHere: 'لا يوجد\nشيء هنا...',
    close: 'إغلاق',
  },
  gamesListScreen: {
    showFavorites: 'عرض المفضلة',
    showFavoritesA11yLabel: 'إظهار المفضلة فقط',
    retroGames: 'ألعاب قديمة',
    rating: 'التقييم<Ratings />:',
    ratings: ' ({{count}} تقييمات)',
    ratingA11yLabel: '{{rating}} نجوم',
  },
  reviewScreen: {
    writeAReview: 'اكتب مراجعة',
    typeYourReview: 'اكتب مراجعتك...',
    submitReview: 'إرسال المراجعة',
    reviews: 'التقييمات: <Stars />',
  },
  gameDetailsScreen: {
    addToFavorites: 'إضافة إلى المفضلة',
    loadingPleaseWait: 'جارٍ التحميل\nيرجى الانتظار...',
    released: 'تاريخ الإصدار:',
    releasedDate: 'تاريخ الإصدار: <date>{{releaseDate, datetime}}</date>',
    genre: 'النوع:',
    studio: 'الاستوديو:',
  },
}

export default ar
