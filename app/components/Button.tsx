import React from 'react'
import type {
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native'
import { Pressable, View } from 'react-native'

import { sizes } from '../../shared/theme'
import type { ThemedStyle } from '../services/theme'
import { useAppTheme } from '../services/theme'
import type { IconProps } from './Icon'
import { Icon } from './Icon'
import type { TextProps } from './Text'
import { Text } from './Text'

interface ButtonProps extends Omit<PressableProps, 'children'> {
  /**
   * The text to display.
   */
  text?: TextProps['text']
  /**
   * The text to display.
   */
  tx?: TextProps['tx']
  /**
   * The icon to be displayed before the text.
   */
  icon?: IconProps['name']
  /**
   * Override the style of the button face element.
   */
  style?: StyleProp<ViewStyle>
}

export const Button = (props: ButtonProps) => {
  const { text, tx, icon, style: $faceOverride, ...RestPressableProps } = props
  const {
    theme: { colors },
    themed,
  } = useAppTheme()

  const $reflectionStyle: PressableProps['style'] = state => [
    themed($reflection),
    state.pressed && themed($reflectionPressed),
  ]

  const $faceStyle: PressableProps['style'] = state => [
    themed($face),
    $faceOverride,
    state.pressed && themed($facePressed),
  ]

  const $textStyle: PressableProps['style'] = state => [
    themed($text),
    state.pressed && themed($textPressed),
  ]

  const iconColor = (state: PressableStateCallbackType) =>
    state.pressed ? colors.text.brand : colors.text.base

  return (
    <Pressable {...RestPressableProps} style={$pressable}>
      {state => (
        <>
          <View style={$reflectionStyle(state)} />

          <View style={$faceStyle(state)}>
            {!!icon && <Icon name={icon} size={18} color={iconColor(state)} />}

            <Text
              preset="label1"
              text={text}
              tx={tx}
              style={$textStyle(state)}
            />
          </View>
        </>
      )}
    </Pressable>
  )
}

const $pressable: ViewStyle = {
  height: 50,
}

const $reflection: ThemedStyle<ViewStyle> = ({ colors }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  bottom: -6,
  right: -6,
  borderRadius: sizes.radius.md,
  backgroundColor: colors.background.transparent,
})

const $reflectionPressed: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background.reflection,
})

const $face: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  borderWidth: sizes.border.sm,
  borderRadius: sizes.radius.md,
  flexDirection: 'row',
  paddingHorizontal: sizes.spacing.md,
  alignItems: 'center',
  justifyContent: 'center',
  columnGap: sizes.spacing.xs,
  backgroundColor: colors.background.brand,
  borderColor: colors.border.base,
})

const $facePressed: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background.accent,
})

const $text: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text.base,
})

const $textPressed: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text.brand,
})
