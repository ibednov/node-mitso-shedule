<script setup lang="ts">
import { tv } from 'tailwind-variants'

interface ButtonPropsType {
  color?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  rounded?: 'full' | 'md' | 'lg'
}
const props = withDefaults(defineProps<ButtonPropsType>(), {
  color: 'primary',
  size: 'md',
  rounded: 'lg',
})

const button = tv({
  base: 'font-medium active:opacity-80',
  variants: {
    color: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-purple-500 text-white',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'px-4 py-3 text-lg',
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
    <button :class="button({ size: props.size, color: props.color, rounded: props.rounded })">
        <slot />
    </button>
</template>
