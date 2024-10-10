<script setup lang="ts">
import { tv } from 'tailwind-variants'

interface ButtonPropsType {
  color?: 'primary' | 'secondary' | 'red' | 'green' | 'yellow' | 'transparent'
  textSize?: 'sm' | 'md' | 'lg'
  size?: 'sm' | 'md' | 'lg'
  rounded?: 'full' | 'md' | 'lg'
  icon?: string
  iconPosition?: 'left' | 'right'
  textAlign?: 'left' | 'center' | 'right'
  justify?: 'start' | 'center' | 'end'
  disabled?: boolean
}
const props = withDefaults(defineProps<ButtonPropsType>(), {
  color: 'primary',
  textSize: 'md',
  rounded: 'xl',
  iconPosition: 'right',
  size: 'md',
  textAlign: 'center',
  justify: 'center',
})

const button = tv({
  base: 'font-medium active:opacity-80',
  variants: {
    color: {
      primary: 'bg-blue-500 text-white border border-blue-500 hover:bg-blue-600',
      secondary: 'bg-purple-500 text-white border border-purple-500 hover:bg-purple-600',
      red: 'bg-red-500 text-white border border-red-500 hover:bg-red-600',
      green: 'bg-green-500 text-white border border-green-500 hover:bg-green-600',
      yellow: 'bg-yellow-500 text-white border border-yellow-500 hover:bg-yellow-600',
      transparent: 'bg-transparent text-black border border-black hover:bg-black/10',
    },
    disabled: {
      true: '!opacity-30 !cursor-not-allowed',
      false: 'cursor-pointer',
    },
    textSize: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
    textAlign: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    },
    size: {
      sm: 'px-2 py-1',
      md: 'px-4 py-2',
      lg: 'px-6 py-3',
    },
    rounded: {
      full: 'rounded-full',
      md: 'rounded-md',
      lg: 'rounded-lg',
      none: 'rounded-none',
      xl: 'rounded-xl',
    },
  },
  defaultVariants: {
    size: props.size,
    color: props.color,
    rounded: props.rounded,
    textSize: props.textSize,
    textAlign: props.textAlign,
    justify: props.justify,
    disabled: props.disabled,
  },
})
</script>

<template>
    <button
        :class="[button({ disabled: props.disabled }), props.iconPosition === 'left' ? 'flex-row-reverse' : 'flex-row']"
        flex
        @click.prevent="props.disabled ? null : $emit('click')"
    >
        <slot />
        <div
            v-if="props.icon"
            :class="props.icon"
        />
    </button>
</template>
