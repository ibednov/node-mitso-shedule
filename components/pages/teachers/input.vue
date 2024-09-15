

<script setup lang="ts">

const teacherName = ref('');

const submitTeacherName = async () => {
  if (teacherName.value.trim() === '') {
    alert('Пожалуйста, введите ФИО преподавателя');
    return;
  }

  const { data, error } = await useFetch('/api/teacher', {
    method: 'POST',
    body: JSON.stringify({ teacherName: teacherName.value }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (error.value) {
    console.error('Ошибка:', error.value);
    alert('Произошла ошибка при отправке данных');
  } else {
    console.log('Успех:', data.value);
    alert('Данные успешно отправлены');
  }
};
</script>
<template>
    <div class="teacher-input">
      <h1>Введите ФИО преподавателя</h1>
      <input v-model="teacherName" placeholder="ФИО преподавателя" />
      <button @click="submitTeacherName">Отправить</button>
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
  </style>
