<script setup lang='ts'>
import { useVModel } from '@vueuse/core'

interface ComponentProps {
  modelValue: string
}
const props = defineProps<ComponentProps>()
const emit = defineEmits(['update:modelValue', 'close'])
const data = useVModel(props, 'modelValue', emit)

const close = () => {
  emit('close')
}
</script>

<template>
    <div
        bg="green-300/60"
        p="x10 y8 r14"
        rounded="xl"

        relative
        flex
        gap-4
    >
        <div
            i-ph="circle-wavy-check-thin"
            text="2xl"
        />
        <div
            text="xl"
            font-medium
        >
            {{ data }}
        </div>
        <ui-button
            icon="i-ph:plus text-base rotate-45"
            color="green"
            p="!1"
            absolute
            right-2
            top-2
            h-fit
            w-fit
            rounded="full"
            @click="close"
        />
    </div>
</template>
