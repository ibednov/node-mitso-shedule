<script setup lang="ts">
import { tv } from 'tailwind-variants'

interface CheckboxPropsType {
  color?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  modelValue: string[] // Изменено на массив строк
  value: string // Значение, которое будет добавлено в массив
  label?: string
  id?: string
}

const props = withDefaults(defineProps<CheckboxPropsType>(), {
  color: 'primary',
  size: 'md',
})
const emit = defineEmits(['update:modelValue'])

const isChecked = computed(() => props.modelValue.includes(props.value))

const toggleValue = () => {
  const newValue = [...props.modelValue]
  if (isChecked.value) {
    const index = newValue.indexOf(props.value)
    if (index > -1) {
      newValue.splice(index, 1)
    }
  }
  else {
    newValue.push(props.value)
  }
  emit('update:modelValue', newValue)
}

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
            :id="id"
            type="checkbox"
            :checked="isChecked"
            :class="checkbox({ size: props.size, color: props.color })"
            @change="toggleValue"
        >
        <label
            v-if="props.label"
            :for="id"
            :class="[`text-${props.size}`]"
            class="text-gray-900 font-medium"
        >{{ props.label }}</label>
    </div>
</template>
