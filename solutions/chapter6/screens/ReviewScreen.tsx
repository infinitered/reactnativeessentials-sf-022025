import React, { useCallback, useState } from 'react'
import { TextInput, View } from 'react-native'
import type { TextStyle, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors, fonts, sizes } from '../../../shared/theme'
import { Button } from '../components/Button'
import { Text } from '../components/Text'
import type { ScreenProps } from '../navigators/AppNavigator'
import { useGlobalState } from '../services/state'

export const ReviewScreen = ({ navigation, route }: ScreenProps<'Review'>) => {
  const { top: paddingTop } = useSafeAreaInsets()
  const [value, setValue] = useState('')

  const state = useGlobalState()
  const { gameId } = route.params

  const backToPrevious = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    } else {
      navigation.navigate('GamesList')
    }
  }, [navigation])

  const submitReview = useCallback(() => {
    if (value) {
      state.appendReview(gameId, value)
      backToPrevious()
    }
  }, [backToPrevious, gameId, value, state])

  return (
    <View style={$modal}>
      <View style={[$container, { paddingTop }]}>
        <Text style={$heading} preset="headline2" text="Write a Review" />
        <View style={$textArea}>
          <TextInput
            style={$textInput}
            placeholder="Type your reivew..."
            multiline
            value={value}
            onChangeText={setValue}
            placeholderTextColor={colors.text.baseMuted}
          />
        </View>
        <View style={$formActions}>
          <Button text="Submit Review" onPress={submitReview} />
          <Button
            text="Close"
            icon="x"
            style={$secondaryButton}
            onPress={backToPrevious}
          />
        </View>
      </View>
    </View>
  )
}

const $modal: ViewStyle = {
  flex: 1,
  backgroundColor: colors.manipulators.changeHexAlpha(
    colors.background.brand,
    75,
  ),
}

const $container: ViewStyle = {
  padding: sizes.spacing.md,
  backgroundColor: colors.background.primary,
  borderColor: colors.border.base,
  borderWidth: sizes.border.sm,
  borderTopWidth: 0,
  paddingBottom: sizes.spacing.md,
  borderBottomLeftRadius: sizes.spacing.lg,
  borderBottomRightRadius: sizes.spacing.lg,
}

const $heading: TextStyle = {
  marginVertical: sizes.spacing.md,
  textAlign: 'center',
}

const $textArea: ViewStyle = {
  borderColor: colors.border.base,
  borderWidth: sizes.border.sm,
  padding: sizes.spacing.sm,
  borderRadius: sizes.spacing.md,
  marginBottom: sizes.spacing.lg,
}

const $textInput: TextStyle = {
  fontFamily: fonts.primary.regular,
  color: colors.text.base,
  borderColor: colors.border.base,
  height: 84,
  overflow: 'scroll',
  textAlignVertical: 'top',
}

const $formActions: ViewStyle = {
  flexDirection: 'column',
  gap: sizes.spacing.md,
  marginTop: sizes.spacing.md,
}

const $secondaryButton: ViewStyle = {
  backgroundColor: colors.background.primary,
}
