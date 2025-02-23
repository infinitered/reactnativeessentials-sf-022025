import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { I18nManager } from 'react-native'
import { getLocales } from 'react-native-localize'

import ar from './locales/ar'
import en from './locales/en'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
export const resources = {
  en,
  ar,
} as const
export const defaultNS = 'common'

const fallbackLng = 'en'
const locale = getLocales()[0]
export const lng = locale.languageCode ?? 'en'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng,
    defaultNS,
    supportedLngs: ['en', 'ar'],
    lng, // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export const isRTL = locale.isRTL
I18nManager.allowRTL(isRTL)
I18nManager.forceRTL(isRTL)

export * from 'i18next'
export * from 'react-i18next'
export default i18n

export const epochToFormattedDate = (epoch: number) => {
  return new Date(epoch * 1000).toLocaleDateString(locale.languageTag, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
