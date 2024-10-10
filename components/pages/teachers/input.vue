<script setup lang="ts">
const teacherName = ref<string[]>(['Беднов А. О.', 'Беднов'])

const availableWeeks = ref<string[]>([])
const selectedWeeks = ref<string[]>([])

const state = ref({
  errorMessage: '',
  message: '',
  status: '',
  isFetching: false,
})

const clearFetchStatus = () => {
  state.value.status = ''
}
const clearMessage = () => {
  state.value.message = ''
}

const setFetching = (value: boolean) => {
  state.value.isFetching = value
}

const fetchAvailableWeeks = async () => {
  setFetching(true)
  clearFetchStatus()
  clearMessage()
  const { data, error, status } = await useFetch('/api/teacher', {
    method: 'GET',
    params: { teacherName: teacherName.value },
  })
  //  при 200 update fetchStatus

  if (error.value) {
    console.error('Ошибка:', error.value)
    state.value.errorMessage = error.value.data.error
    setFetching(false)
  }
  else {
    availableWeeks.value = data.value.weeks
    if (data.value && status && status.value === 'success') {
      state.value.status = `weeks_fetched_${status.value}`
    }
    setFetching(false)
  }
}

const submitTeacherName = async () => {
  state.value.errorMessage = ''

  if (teacherName.value[0].trim() === '') {
    console.warn('Пожалуйста, введите ФИО преподавателя')
    return
  }

  await fetchAvailableWeeks()
}

const submitSelectedWeeks = async () => {
  setFetching(true)
  clearFetchStatus()
  clearMessage()
  const { data, error, status } = await useFetch('/api/teacher', {
    method: 'POST',
    body: JSON.stringify({ teacherName: teacherName.value, selectedWeeks: selectedWeeks.value }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (error.value) {
    console.error('Ошибка:', error.value)
    state.value.errorMessage = error.value.data.error
    console.warn('Произошла ошибка при отправке данных')
  }
  else {
    console.warn('Успех:', data.value)
    console.warn('Данные успешно отправлены')
    if (status && status.value === 'success') {
      state.value.status = `weeks_saved_${status.value}`
      selectedWeeks.value = []
      availableWeeks.value = []
      state.value.message = 'Недели успешно сохранены'
    }
  }
  setFetching(false)
}

const addTeacher = () => {
  teacherName.value.push('')
}

const updateTeacherName = (index: number, value: string) => {
  teacherName.value[index] = value
}

const removeTeacher = (teacher: string) => {
  // dont use .filter() by name because it will remove all teachers with the same name
  teacherName.value = teacherName.value.filter(name => name !== teacher)
}

// onMounted(() => {
//   // Fetch available weeks when the component is mounted
//   // if (teacherName.value.trim() !== '') {
//   //   fetchAvailableWeeks()
//   // }
// })
</script>

<template>
    <div
        v-auto-animate
        self-center
        flex="~ col"
        gap="8"
    >
        <ui-spinner
            v-if="state.isFetching"
            fullwidth
        />
        <ui-alert
            v-if="state.message"
            v-model="state.message"
            @close="clearMessage"
        />
        <div
            flex="~ col"
            gap="4"
        >
            <div

                flex
                items-center
                justify-between
                gap-12
            >
                <div>
                    <div
                        text="2xl"
                        font="bold"
                    >
                        Преподаватель
                    </div>
                    <div>
                        Введите ФИО преподавателя
                    </div>
                </div>

                <ui-button
                    icon="i-ph:plus"
                    h-fit
                    color="green"
                    rounded="full"
                    :disabled="state.isFetching"
                    @click="addTeacher"
                />
            </div>
            <div
                flex="~ col"
                gap-4
            >
                <div
                    flex="~ col"
                    gap-2
                >
                    <div
                        v-for="(teacher, index) in teacherName"
                        :key="index"
                        flex
                        justify-between
                        gap-4
                    >
                        <ui-input-text
                            :model-value="teacher"
                            w-full
                            placeholder="ФИО преподавателя"
                            @update:model-value="updateTeacherName(index, $event)"
                        />
                        <ui-button
                            icon="i-ph:trash"
                            h-fit
                            rounded="full"
                            color="red"
                            :disabled="teacherName.length <= 1 || state.isFetching"
                            @click="removeTeacher(teacher)"
                        />
                    </div>
                </div>
                <ui-button
                    :disabled="state.isFetching"
                    @click="submitTeacherName"
                >
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
                <div
                    v-for="week in availableWeeks"
                    :key="week"
                >
                    <ui-input-checkbox
                        :id="`checkbox-${week}`"
                        v-model="selectedWeeks"
                        :value="week"
                        :label="week"
                    />
                </div>
            </div>
            <ui-button
                :disabled="state.isFetching"
                @click="submitSelectedWeeks"
            >
                Сохранить выбранные недели
            </ui-button>
        </div>

        <div v-if="errorMessage">
            {{ errorMessage }}
        </div>
    </div>
</template>
