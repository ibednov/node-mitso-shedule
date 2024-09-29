<script setup lang="ts">
import { onMounted, ref } from 'vue'

const teacherName = ref('')
const errorMessage = ref('')
const availableWeeks = ref<string[]>([])
const selectedWeeks = ref<string[]>([])

const fetchAvailableWeeks = async () => {
  const { data, error } = await useFetch('/api/teacher', {
    method: 'GET',
    params: { teacherName: teacherName.value },
  })

  if (error.value) {
    console.error('Ошибка:', error.value)
    errorMessage.value = error.value.data.error
  }
  else {
    availableWeeks.value = data.value.weeks
  }
}

const submitTeacherName = async () => {
  errorMessage.value = ''

  if (teacherName.value.trim() === '') {
    console.warn('Пожалуйста, введите ФИО преподавателя')
    return
  }

  await fetchAvailableWeeks()
}

const submitSelectedWeeks = async () => {
  const { data, error } = await useFetch('/api/teacher', {
    method: 'POST',
    body: JSON.stringify({ teacherName: teacherName.value, selectedWeeks: selectedWeeks.value }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (error.value) {
    console.error('Ошибка:', error.value)
    errorMessage.value = error.value.data.error
    console.warn('Произошла ошибка при отправке данных')
  }
  else {
    console.warn('Успех:', data.value)
    console.warn('Данные успешно отправлены')
  }
}

onMounted(() => {
  // Fetch available weeks when the component is mounted
  if (teacherName.value.trim() !== '') {
    fetchAvailableWeeks()
  }
})
</script>

<template>
    <div
        v-auto-animate
        self-center
        flex="~ col"
        gap="8"
    >
        <div
            flex="~ col"
            gap="4"
        >
            <div
                text="2xl"
                font="bold"
            >
                Введите ФИО преподавателя
            </div>
            <div
                flex
                gap-2
            >
                <ui-input-text
                    v-model="teacherName"
                    placeholder="ФИО преподавателя"
                />
                <ui-button @click="submitTeacherName">
                    Отправить
                </ui-button>
            </div>
        </div>

        <div
            v-if="availableWeeks.length > 0"
            flex="~ col"
            gap="6"
        >
            <div
                flex="~ col"
                gap="4"
            >
                <div
                    text="2xl"
                    font="bold"
                >
                    Выберите недели
                </div>
                {{ selectedWeeks }}
                <div
                    v-for="week in availableWeeks"
                    :key="week"
                >
                    <ui-input-checkbox
                        v-model="selectedWeeks"
                        :value="week"
                        :label="week"
                    />
                </div>
            </div>
            <ui-button @click="submitSelectedWeeks">
                Сохранить выбранные недели
            </ui-button>
        </div>

        <div v-if="errorMessage">
            {{ errorMessage }}
        </div>
    </div>
</template>
