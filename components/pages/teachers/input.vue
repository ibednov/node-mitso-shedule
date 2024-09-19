<script setup lang="ts">
import { ref, onMounted } from 'vue';

const teacherName = ref('');
const errorMessage = ref('');
const availableWeeks = ref<string[]>([]);
const selectedWeeks = ref<string[]>([]);

const fetchAvailableWeeks = async () => {
  const { data, error } = await useFetch('/api/teacher', {
    method: 'GET',
    params: { teacherName: teacherName.value },
  });

  if (error.value) {
    console.error('Ошибка:', error.value);
    errorMessage.value = error.value.data.error;
  } else {
    availableWeeks.value = data.value.weeks;
  }
};

const submitTeacherName = async () => {
  errorMessage.value = '';

  if (teacherName.value.trim() === '') {
    alert('Пожалуйста, введите ФИО преподавателя');
    return;
  }

  await fetchAvailableWeeks();
};

const submitSelectedWeeks = async () => {
  const { data, error } = await useFetch('/api/teacher', {
    method: 'POST',
    body: JSON.stringify({ teacherName: teacherName.value, selectedWeeks: selectedWeeks.value }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (error.value) {
    console.error('Ошибка:', error.value);
    errorMessage.value = error.value.data.error;
    alert('Произошла ошибка при отправке данных');
  } else {
    console.log('Успех:', data.value);
    alert('Данные успешно отправлены');
  }
};

onMounted(() => {
  // Fetch available weeks when the component is mounted
  if (teacherName.value.trim() !== '') {
    fetchAvailableWeeks();
  }
});
</script>

<template>
  <div class="teacher-input">
    <h1>Введите ФИО преподавателя</h1>
    <input v-model="teacherName" placeholder="ФИО преподавателя" />
    <button @click="submitTeacherName">Отправить</button>

    <div v-if="availableWeeks.length > 0">
      <h2>Выберите недели</h2>
      <div v-for="week in availableWeeks" :key="week">
        <input type="checkbox" :value="week" v-model="selectedWeeks" /> {{ week }}
      </div>
      <button @click="submitSelectedWeeks">Сохранить выбранные недели</button>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.teacher-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}

input {
  padding: 10px;
  margin-bottom: 20px;
  width: 300px;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.error {
  color: red;
  margin-top: 20px;
}
</style>
