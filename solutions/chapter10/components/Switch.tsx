import React from 'react'
import type { AccessibilityProps, ViewStyle } from 'react-native'
import { Switch as RNSwitch, View } from 'react-native'

import { useAppTheme } from '../services/theme'

interface SwitchProps extends AccessibilityProps {
  on: boolean
  onToggle?: () => void
}

export const Switch = (props: SwitchProps) => {
  const { on, onToggle, ...accessibilityProps } = props
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <View
      style={$container}
      accessible
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      {...accessibilityProps}>
      <RNSwitch
        ios_backgroundColor={
          on ? colors.background.accent : colors.background.accentMuted
        }
        onValueChange={onToggle}
        thumbColor={on ? colors.background.brand : colors.background.accent}
        trackColor={{
          false: colors.background.accentMuted,
          true: colors.background.accent,
        }}
        value={on}
      />
    </View>
  )
}

const $container: ViewStyle = {
  alignItems: 'center',
  height: 31,
  justifyContent: 'center',
  width: 51,
}
