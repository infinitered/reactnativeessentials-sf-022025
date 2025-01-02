import React, { useMemo, useState } from 'react'
import type { TextStyle } from 'react-native'
import { DevSettings, Platform } from 'react-native'
import { MMKV } from 'react-native-mmkv'

import { Text } from '../../solutions/chapter7/components/Text'
import { colors, fonts } from '../theme'

const storage = new MMKV({ id: '@RNEssentials/training' })

export type AppModes = (typeof appModes)[number]['value']

const appModes = [
  { label: 'Assignment', value: 'assignment' },
  { label: 'Chapter 1', value: 'chapter1' },
  { label: 'Chapter 2', value: 'chapter2' },
  { label: 'Chapter 3', value: 'chapter3' },
  { label: 'Chapter 4', value: 'chapter4' },
  { label: 'Chapter 5', value: 'chapter5' },
  { label: 'Chapter 6', value: 'chapter6' },
  { label: 'Chapter 7', value: 'chapter7' },
  { label: 'Chapter 8', value: 'chapter8' },
  { label: 'Chapter 9', value: 'chapter9' },
  { label: 'Chapter 10', value: 'chapter10' },
] as const

export function setupTrainingAppModeSelector() {
  const activeAppMode =
    (storage.getString('appMode') as AppModes) || 'assignment'

  appModes.forEach(f => {
    const title = [
      '⚈ ',
      f.label,
      f.value !== 'assignment' && 'Solution',
      Platform.OS === 'android' ? false : ' ⚈',
    ]
      .filter(Boolean)
      .join(' ')

    DevSettings.addMenuItem(title, () => {
      storage.set('appMode', f.value)
      DevSettings.reload()
    })
  })

  return activeAppMode
}

export function TrainingBanner({ appMode }: { appMode: AppModes }) {
  const [bannerVisible, setBannersVisible] = useState(true)

  const label = useMemo(() => {
    const l = appModes.find(f => f.value === appMode)?.label

    if (!l) return null

    return Array.from({ length: 6 }, () => l).join('       ')
  }, [appMode])

  if (appMode === 'assignment') return null
  if (!bannerVisible) return null
  if (!label) return null

  return (
    <Text
      text={label ?? ''}
      preset="body"
      style={$solutionLabel}
      numberOfLines={1}
      ellipsizeMode="clip"
      onPress={() => setBannersVisible(false)}
    />
  )
}

const $solutionLabel: TextStyle = {
  width: '100%',
  color: colors.text.overlay,
  fontSize: 12,
  lineHeight: 18,
  height: 18,
  fontFamily: fonts.primary.bold,
  textAlign: 'center',
  backgroundColor: colors.tint.accent,
}
