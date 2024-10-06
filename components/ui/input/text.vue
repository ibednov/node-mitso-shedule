<script setup lang="ts">
import { tv } from 'tailwind-variants'

import { useVModel } from '@vueuse/core'

interface InputPropsType {
  color?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  modelValue: string
  rounded?: 'full' | 'md' | 'lg'
}
const props = withDefaults(defineProps<InputPropsType>(), {
  color: 'primary',
  size: 'md',
  rounded: 'lg',
})
const emit = defineEmits(['update:modelValue'])
const data = useVModel(props, 'modelValue', emit)

const input = tv({
  base: 'border px-3 py-2 focus:outline-none focus:ring-2',
  variants: {
    color: {
      primary: 'border-blue-500 focus:ring-blue-500',
      secondary: 'border-purple-500 focus:ring-purple-500',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg px-4 py-3',
    },
    rounded: {
      full: 'rounded-full',
      md: 'rounded-md',
      lg: 'rounded-lg',
    },
  },
  compoundVariants: [
    {
      size: ['sm', 'md'],
      class: 'px-3 py-1',
    },
  ],
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
})
</script>

<template>
    <input
        v-model="data"
        :class="input({ size: props.size, color: props.color, rounded: props.rounded })"
    >
</template>
