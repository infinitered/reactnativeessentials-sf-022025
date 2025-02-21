### Chapter 9

Run `./scripts/skipTo 9` to copy the solution to your main app. Otherwise you may code along. Reference `./solutions/chapter9` if you get stuck.

# Chapter 9: Internationalize All The Things

In this chapter, we will learn how to internationalize our app. We will use the `react-i18next` library to translate our app into multiple languages (including RTL languages). This will allow us to provide a better user experience for users who speak different languages. Please listen to my talk at [`React Universe Conf 2024`](https://www.youtube.com/watch?v=JwUGmnT1GiI) for more information on the importance of internationalization.

## Tasks for this section [code-a-long]

### 1. Dependencies Review

a. `react-i18next` and `i18next` will be used to translate our app into multiple languages
b. `react-native-localize` will provide us access to the locale data on the native device

### 2. Create i18n files

### a. Create a `app/services/locales` folder and create the following files:

1. `en.ts` - English translation file
2. `ar.ts` - Arabic translation file

```ts
const en = {
  common: {
    ...
  },
  ...
}

export default en
export type Translations = typeof en
```

You'll notice we're using TS instead of JSON here and that's just how we do it at Infinite Red to make sure all keys propagate down to other translation files.

### b. Create a `i18n.ts` file in the `app/services` folder

```ts
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
```

### 3. Import init file

Import the init file we did created earlier in our main app entry point, `app/App.tsx`.

```tsx
import './services/i18n'
```

### 4. Update each screen/component [DIY]

Update each screen and component with your translations! Let me give you a couple examples:

#### a. Update `Text` component

```tsx
export interface TextProps extends RNTextProps {
  ...
  /**
   * Text which is looked up via i18n.
   */
  tx?: ParseKeys
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: TOptions
}

export const Text = (props: TextProps) => {
  const {
    tx,
    txOptions,
    ...
  } = props
  const i18nText = tx && t(tx, txOptions)
  const content = i18nText ?? text ?? children
  ...
}
```

#### b. Use the `useTranslation` hook

```diff
export const Empty = (props: {
-  text?: string
+  tx?: TextProps['tx']
  icon?: IconProps['name']
}) => {
  const {
    theme: { colors },
    themed,
  } = useAppTheme()
+  const { t } = useTranslation()
  return (
    <View style={$emptyContentWrapper}>
      <Icon
        color={colors.tint.baseMuted}
        size={36}
        name={props.icon ?? 'frown'}
      />
      <Text
        preset="display"
-        text={props.text ?? "There's\nNothing Here..."}
+        tx={props.tx ?? t('common:theresNothingHere')}
        style={themed($emptyText)}
      />
    </View>
  )
}
```

#### c. Use the `Trans` component

While `<Trans>` gives you a lot of power by letting you interpolate or translate complex React elements, the truth is: in most cases you don't even need it.

Let's give it a try in the `Card` component:

```diff
- <Text preset="label2" text="Released:" />
- <Text preset="title2" text={releaseDate} />
+ <Text preset="label2">
+   <Trans
+     ns="gameDetailsScreen"
+     i18nKey="releasedDate"
+     components={{
+       date: <Text preset="title2" />,
+     }}
+     values={{
+       releaseDate,
+     }}
+   />
+ </Text>
```

This is what our `en.ts` file will look like:

```ts
const en = {
  gameDetailsScreen: {
    releasedDate: 'Released: <date>{{releaseDate, datetime}}</date>',
    ...
  },
  ...
}
```

#### d. RTL Style

In order to handle RTL styles, there are a couple considerations to keep in mind:

```tsx
// anywhere we have `flexDirection: 'row'`, we need to change it to `row-reverse`
const $card: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flexDirection: isRTL ? 'row-reverse' : 'row',
})
// anywhere we have `textAlign: 'left'` or `writingDirection: 'ltr'`, we need to change it to `right`
const $name: TextStyle = {
  textAlign: isRTL ? 'right' : 'left',
  writingDirection: isRTL ? 'rtl' : 'ltr',
}
```

#### e. NOTE: Date fix

Update the `GamesListScreen` to use the date and not the "human" date:

```diff
- releaseDate={item.releaseDate.human}
+ releaseDate={item.releaseDate.date}
```

Add the `epochToFormattedDate` function to the `i18n.ts` file:

```ts
export const epochToFormattedDate = (epoch: number) => {
  return new Date(epoch * 1000).toLocaleDateString(locale.languageTag, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
```

And use it in the `Card` component:

```tsx
<Trans
 ...
  values={
    releaseDate: epochToFormattedDate(releaseDate),
  }
/>
```
