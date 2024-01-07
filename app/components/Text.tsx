import React from 'react';
import {
  Text as RNText,
  StyleProp,
  TextStyle,
  type TextProps as RNTextProps,
} from 'react-native';
import {colors, fonts} from '../theme';

interface TextProps extends RNTextProps {
  /**
   * One of the different types of text presets.
   */
  preset?: keyof typeof $presets;
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string;
}

export const Text = (props: TextProps) => {
  const {
    text,
    children,
    preset = 'body',
    style: $styleOverride,
    ...RestTextProps
  } = props;

  const content = text ?? children;

  const $textStyle = [$base, $presets[preset], $styleOverride];

  return (
    <RNText {...RestTextProps} style={$textStyle}>
      {content}
    </RNText>
  );
};

const $base: TextStyle = {color: colors.tokens.textBase};

const $presets = {
  display: {fontSize: 36, lineHeight: 44, fontFamily: fonts.primary.regular},
  headline1: {fontSize: 28, lineHeight: 36, fontFamily: fonts.primary.semiBold},
  headline2: {fontSize: 24, lineHeight: 32, fontFamily: fonts.primary.semiBold},
  title1: {fontSize: 16, lineHeight: 24, fontFamily: fonts.primary.medium},
  title2: {fontSize: 14, lineHeight: 20, fontFamily: fonts.primary.medium},
  label1: {fontSize: 14, lineHeight: 20, fontFamily: fonts.primary.bold},
  label2: {fontSize: 12, lineHeight: 16, fontFamily: fonts.primary.bold},
  body: {fontSize: 14, lineHeight: 20, fontFamily: fonts.primary.regular},
} satisfies Record<string, StyleProp<TextStyle>>;
