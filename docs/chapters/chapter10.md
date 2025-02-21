### Chapter 10

Run `./scripts/skipTo 10` to copy the solution to your main app. Otherwise you may code along. Reference `./solutions/chapter10` if you get stuck.

# Chapter 10: Accessibility Essentials

In this chapter, we'll learn about using the accessibility features of React Native. Having an accessible app is critical for ensuring the best possible experience for all of your users, and in some cases is legally required.

What do we mean when we say an app is accessible? The answer is many things, including but not limited to:

- Gracefully handling text magnification
- Color-blind friendly design colors
- Support for assistive technologies like screen readers

For the purpose of this lesson we will primarily be focusing on assistive technologies, namely VoiceOver on iOS and Talkback on Android, which assist non-sighted users in using your app by reading out descriptions of the content and interactive elements.

## Accessibility Tools

[React Native accessibility docs](https://reactnative.dev/docs/accessibility)
[iOS voiceover cheatsheet](https://support.apple.com/guide/iphone/use-voiceover-gestures-iph3e2e2281/ios)
[Android talkback cheatsheet](https://dequeuniversity.com/assets/pdf/screenreaders/talkback-guide.pdf)

Show the simulator with the accessibility inspector

Show how to turn on voiceover with the side button

- Settings -> Accessibility -> Accessibility Shortcut. Tap "Voiceover".

- Try using VoiceOver in the app

Here are some issues we notice:

- not knowing the value of the toggle or what it does
- no star rating read out

  Double tap into detail screen on first game

- add to favorite toggle not read out
- info should be read with label and text as one unit for continuity
- stars selected individually instead of read as a unit

  (Go into "Write a Review" and fill out one, then refresh by going back to the list, then re-enter the detail screen. Then go down and check the reviews section)

- review not clear what it is. Should have a hint.

## Accessibile Views and Labels

First let's fix the star ratings:

### List screen

Go into `Rating.tsx`

Add accessible view around star icons. Add label. Adjust container styles to be `flexDirection: 'row'`

```diff
           }}
         />
       </Text>
+      <View
+        style={$starContainer}
+        accessible
+        accessibilityLabel={`${rating} stars`}>
         {Array.from({ length: rating }).map((_, i) => (
           <Icon color={colors.tint.accent} key={i} name="star" />
         ))}
       </View>
+    </View>
   )
 }

   flexDirection: isRTL ? 'row-reverse' : 'row',
   columnGap: sizes.spacing.xs,
   alignItems: 'center',
+}
+
+const $starContainer: ViewStyle = {
+  flexDirection: isRTL ? 'row-reverse' : 'row',
 }

 const $label: TextStyle = {
```

This should apply to the detail screen as well since they both use the Rating component

### Detail Screen

Now let's fix some of the label/value continuity.

1. Add `accessible` to all `$informationRow` views. Now they read out as one cohesive unit. (note verbally that this could be a great opportunity to DRY up with a custom InfoRow component)

```diff
-             <View style={$informationRow}>
+             <View style={$informationRow} accessible>
                <Text preset="label2" text="Released:" />
                <Text
                  preset="title2"
                  text={releaseDate?.human}
                  style={$informationValue}
                />
              </View>

```

2. Let's also add `accessible` to the outer view wrapping the star rating and label in `Rating`

### List of Reviews

When the reviews are read out, there is no differention between them.

Two approaches we could take:

- add more information to the accessibility label
- modify the design to include visual text labels instead of relying on whitespace only

1. Let's just add more to the a11y label

Add `accessible` and `accessiblityLabel` to `Reviews` (view inside the `map` on line 172)

Show in voiceover that it completely replaces the label. Need to add back in the text.

```diff
-        <View key={index} style={themed($reviewWrapper)}>
+        <View
+          key={index}
+          style={themed($reviewWrapper)}
+          accessible
+          accessibilityLabel={`Review ${index + 1}: ${review}`}>
```

## Accessibility State

Accessibility state describes the current state of a boolean control-type component such as a toggle, checkbox, radio button, dropdown, etc.

If we had a variable control type such as a slider or progress bar, we would use `accessiblityValue`.

### Favorite Toggle - List screen

Our toggle doesn't tell the user what it's for or what state it is in.

First make the Switch accessible and give it state, and an accessibilityRole:

```diff
 import React from 'react'
-import type { ViewStyle } from 'react-native'
+import type { AccessibilityProps, ViewStyle } from 'react-native'
 import { Switch as RNSwitch, View } from 'react-native'

 import { useAppTheme } from '../services/theme'

-interface SwitchProps {
+interface SwitchProps extends AccessibilityProps {
   on: boolean
   onToggle: () => void
 }

 export const Switch = (props: SwitchProps) => {
-  const { on, onToggle } = props
+  const { on, onToggle, ...accessibilityProps } = props
   const {
     theme: { colors },
   } = useAppTheme()
+
   return (
-    <View style={$container}>
+    <View
+      style={$container}
+      accessible
+      accessibilityRole="switch"
+      accessibilityState={{ checked: on }}
+      {...accessibilityProps}
+      >
       <RNSwitch
         ios_backgroundColor={
           on ? colors.background.accent : colors.background.accentMuted
```

See [docs](https://reactnative.dev/docs/accessibility#accessibilityrole) for all of the available roles

Now add the label text via the list screen:

```diff
       <View style={themed($favoritesFilter)}>
         <Text preset="title1" tx={'gamesListScreen:showFavorites'} />
         <Switch
+          accessibilityLabel="Show only favorites"
           on={filterFavorites}
           onToggle={() => setFilterFavorites(!filterFavorites)}
         />
```

---

[Previous: Chapter 9](./chapter09.md) | [Next: Chapter 11](./chapter11.md)
