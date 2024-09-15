

<script setup lang="ts">
import { useFileSystemAccess } from '@vueuse/core';

const teacherName = ref('');
const errorMessage = ref('');
const fileContent = ref('');

const { saveAs } = useFileSystemAccess({
  dataType: 'Text',
  types: [{
    description: 'ICS file',
    accept: {
      'text/calendar': ['.ics'],
    },
  }],
  excludeAcceptAllOption: true,
});

const submitTeacherName = async () => {
  errorMessage.value = '';
  fileContent.value = '';

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
    errorMessage.value = error.value.data.error;
    alert('Произошла ошибка при отправке данных');
  } else {
    console.log('Успех:', data.value);
    if (data.value.fileContent) {
      fileContent.value = data.value.fileContent;
    }
    alert('Данные успешно отправлены');
  }
};

const saveFile = async () => {
  if (fileContent.value) {
    await saveAs(fileContent.value, `calendar_${teacherName.value}.ics`);
  }
};
</script>


<template>
  <div class="teacher-input">
    <h1>Введите ФИО преподавателя</h1>
    <input v-model="teacherName" placeholder="ФИО преподавателя" />
    <button @click="submitTeacherName">Отправить</button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <div v-if="fileContent">
      <h2>Сохранить файл</h2>
      <button @click="saveFile">Сохранить</button>
    </div>
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
