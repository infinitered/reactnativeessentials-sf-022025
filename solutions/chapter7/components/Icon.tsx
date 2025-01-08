import VectorIcon from '@react-native-vector-icons/feather'
import React, { ComponentProps } from 'react'

import { colors } from '../../../shared/theme'

export interface IconProps {
  name: ComponentProps<typeof VectorIcon>['name']
  size?: number
  color?: string
}

export const Icon = (props: IconProps) => {
  const { name, size = 24, color = colors.tint.base } = props

  return <VectorIcon name={name} size={size} color={color} />
}
