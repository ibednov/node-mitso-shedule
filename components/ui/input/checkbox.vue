<script setup lang="ts">
import { tv } from 'tailwind-variants'
import { useVModel } from '@vueuse/core'

interface CheckboxPropsType {
  color?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  modelValue: boolean
  label?: string
}

const props = withDefaults(defineProps<CheckboxPropsType>(), {
  color: 'primary',
  size: 'md',
})
const emit = defineEmits(['update:modelValue'])
const data = useVModel(props, 'modelValue', emit)

const checkbox = tv({
  base: 'border rounded-full bg-black focus:outline-none focus:ring-2',
  variants: {
    color: {
      primary: 'bg-black border-blue-500 focus:ring-blue-500',
      secondary: 'border-purple-500 focus:ring-purple-500',
    },
    size: {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    },
  },
})
</script>

<template>
    <div
        flex
        items-center
        gap-2
    >
        <input
            id="default-checkbox"
            v-model="data"
            rounded-full
            type="checkbox"
            :class="checkbox({ size: props.size, color: props.color })"
        >
        <label
            v-if="props.label"
            for="default-checkbox"
            :class="[`text-${props.size}`]"
            class="text-gray-900 font-medium"
        >{{ props.label }}</label>
    </div>
</template>
