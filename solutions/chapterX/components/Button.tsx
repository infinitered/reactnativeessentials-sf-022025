import React from 'react'
import { Pressable, View } from 'react-native'
import type {
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native'

import { colors, sizes } from '../../../shared/theme'
import { Icon } from './Icon'
import type { IconProps } from './Icon'
import { Text } from './Text'

interface ButtonProps extends Omit<PressableProps, 'children'> {
  /**
   * The text to display.
   */
  text?: string
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
  const { text, icon, style: $faceOverride, ...RestPressableProps } = props

  const $reflectionStyle: PressableProps['style'] = state => [
    $reflection,
    state.pressed && $reflectionPressed,
  ]

  const $faceStyle: PressableProps['style'] = state => [
    $face,
    $faceOverride,
    state.pressed && $facePressed,
  ]

  const $textStyle: PressableProps['style'] = state => [
    $text,
    state.pressed && $textPressed,
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

            <Text preset="label1" text={text} style={$textStyle(state)} />
          </View>
        </>
      )}
    </Pressable>
  )
}

const $pressable: ViewStyle = {
  height: 50,
}

const $reflection: ViewStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  bottom: -6,
  right: -6,
  borderRadius: sizes.radius.md,
  backgroundColor: colors.background.transparent,
}

const $reflectionPressed: ViewStyle = {
  backgroundColor: colors.background.reflection,
}

const $face: ViewStyle = {
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
}

const $facePressed: ViewStyle = {
  backgroundColor: colors.background.accent,
}

const $text: TextStyle = {
  color: colors.text.base,
}

const $textPressed: TextStyle = {
  color: colors.text.brand,
}
