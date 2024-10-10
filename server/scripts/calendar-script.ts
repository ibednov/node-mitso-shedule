import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import axios from 'axios'
import type { EventAttributes } from 'ics'
import { createEvents } from 'ics'
import { config } from 'dotenv'

config() // Загружаем переменные окружения из .env

const apiBaseUrl: string = process.env.API_BASE_URL || ''

// Проверка на существование API_BASE_URL
if (!apiBaseUrl) {
  throw new Error('API_BASE_URL не задан в переменных окружения')
}

// Получаем текущий путь к директории
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface Lesson {
  time: string
  date: string
  group_class: string
  auditorium: string
  subject: string
  teacher: string
  kurse: string
}

interface Schedule {
  [week: string]: {
    [date: string]: Lesson[]
  }
}

const getSubjects = async (teacherNames: string[]): Promise<{ name: string }[]> => {
  const allSubjects: { name: string }[] = []

  for (const teacherName of teacherNames) {
    const teacherNameEncoded: string = encodeURIComponent(teacherName)
    try {
      const response = await axios.get(`${apiBaseUrl}/teacher-subjects?teacher=${teacherNameEncoded}`)
      console.warn(`Ответ от API для предметов преподавателя ${teacherName}:`, response.data)
      allSubjects.push(...response.data)
    }
    catch (error) {
      console.error(`Ошибка при получении предметов для преподавателя ${teacherName}:`, error)
      throw error
    }
  }

  // Удаляем дубликаты предметов
  return Array.from(new Set(allSubjects.map(subject => subject.name))).map(name => ({ name }))
}

const getSchedule = async (teacherNames: string[], subject: string): Promise<Schedule> => {
  const combinedSchedule: Schedule = {}

  for (const teacherName of teacherNames) {
    const teacherNameEncoded: string = encodeURIComponent(teacherName)
    const subjectEncoded: string = encodeURIComponent(subject)
    try {
      const response = await axios.get(`${apiBaseUrl}/teacher-subject-schedules?teacher=${teacherNameEncoded}&subject=${subjectEncoded}`)
      console.warn(`Ответ от API для расписания предмета ${subject} преподавателя ${teacherName}:`, response.data)

      // Объединяем расписания
      for (const week in response.data) {
        if (!combinedSchedule[week]) {
          combinedSchedule[week] = {}
        }
        for (const date in response.data[week]) {
          if (!combinedSchedule[week][date]) {
            combinedSchedule[week][date] = []
          }
          combinedSchedule[week][date].push(...response.data[week][date])
        }
      }
    }
    catch (error) {
      console.error(`Ошибка при получении расписания для предмета ${subject} преподавателя ${teacherName}:`, error)
      throw error
    }
  }

  return combinedSchedule
}

const createCalendarEvents = (schedule: Schedule): { events: EventAttributes[], minDate: string | null, maxDate: string | null } => {
  const events: EventAttributes[] = []
  const eventMap: Map<string, EventAttributes> = new Map()
  const groupMap: Map<string, Set<string>> = new Map()
  const teacherMap: Map<string, Set<string>> = new Map()
  const subgroupMap: Map<string, Set<string>> = new Map() // Карта для хранения номеров подгрупп
  let minDate: string | null = null
  let maxDate: string | null = null

  for (const week in schedule) {
    for (const date in schedule[week]) {
      if (!minDate || new Date(date) < new Date(minDate)) {
        minDate = date
      }
      if (!maxDate || new Date(date) > new Date(maxDate)) {
        maxDate = date
      }

      schedule[week][date].forEach((lesson) => {
        console.warn(`Обработка урока: ${JSON.stringify(lesson)}`)

        const normalizedTime = lesson.time.replace(/[.,]/g, ':')
        const [startHour, startMinute] = normalizedTime.split(' - ')[0].split(':').map(Number)
        const [endHour, endMinute] = normalizedTime.split(' - ')[1].split(':').map(Number)
        const [year, month, day] = lesson.date.split('-').map(Number)

        if (Number.isNaN(startHour) || Number.isNaN(startMinute) || Number.isNaN(endHour) || Number.isNaN(endMinute)) {
          console.error(`Некорректное время для урока: ${lesson.subject} на дату ${lesson.date}`)
          return
        }

        const auditorium = lesson.auditorium.trim() || 'аудитория не указана'

        // Извлекаем номер подгруппы и нормализуем название дисциплины
        const subgroupMatch = lesson.subject.match(/^(\d+)\.\s*/)
        const subgroupNumber = subgroupMatch ? subgroupMatch[1] : ''
        const normalizedSubject = lesson.subject.replace(/^\d+\.\s*/, '').trim()
        const eventKey = `${date}-${normalizedTime}-${normalizedSubject}`

        if (eventMap.has(eventKey)) {
          const existingEvent = eventMap.get(eventKey)!
          existingEvent.description += `\nОбъединено с: ${lesson.group_class} / ${auditorium}`
          existingEvent.title += ' (Объединено)'

          // Обновление информации о группах и подгруппах
          const groups = groupMap.get(eventKey)!
          groups.add(lesson.group_class)
          const teachers = teacherMap.get(eventKey)!
          teachers.add(lesson.teacher)
          const subgroups = subgroupMap.get(eventKey)!
          if (subgroupNumber)
            subgroups.add(subgroupNumber)
          existingEvent.description = `${normalizedSubject}\nПреподаватель: ${Array.from(teachers).join(', ')}\nАудитория: ${auditorium}\nГруппа: ${Array.from(groups).join(' и ')}\nПодгруппа: ${Array.from(subgroups).join(', ')}\nКурс: ${lesson.kurse}`
        }
        else {
          const newEvent: EventAttributes = {
            start: [year, month, day, startHour, startMinute],
            end: [year, month, day, endHour, endMinute],
            title: `${lesson.group_class} / ${auditorium} / ${normalizedSubject} (Подгруппа: ${subgroupNumber})`,
            description: `${normalizedSubject}\nПреподаватель: ${lesson.teacher}\nАудитория: ${auditorium}\nГруппа: ${lesson.group_class}\nПодгруппа: ${subgroupNumber}\nКурс: ${lesson.kurse}`,
            location: auditorium,
            status: 'CONFIRMED',
            busyStatus: 'BUSY',
          }
          eventMap.set(eventKey, newEvent)
          groupMap.set(eventKey, new Set([lesson.group_class]))
          teacherMap.set(eventKey, new Set([lesson.teacher]))
          subgroupMap.set(eventKey, new Set(subgroupNumber ? [subgroupNumber] : []))
        }
      })
    }
  }

  events.push(...eventMap.values())
  return { events, minDate, maxDate }
}

const saveCalendar = (events: EventAttributes[], minDate: string | null, maxDate: string | null, teacherName: string): void => {
  if (!fs.existsSync(path.join(__dirname, '../../results'))) {
    fs.mkdirSync(path.join(__dirname, '../../results'))
  }
  createEvents(events, (error, value) => {
    if (error) {
      console.error('Ошибка при создании событий календаря:', error)
      return
    }
    const fileName = `calendar_${teacherName}_${minDate}_to_${maxDate}.ics`
    const filePath = path.join(__dirname, '../../results', fileName)
    fs.writeFileSync(filePath, value)
    console.warn(`Файл календаря создан: ${filePath}`)
  })
}

export const runScript = async (teacherNames: string[], selectedWeeks: string[]): Promise<{ name: string }[]> => {
  try {
    const subjects = await getSubjects(teacherNames)
    console.warn(`Получены предметы для преподавателей ${teacherNames.join(', ')}:`, subjects)
    let allEvents: EventAttributes[] = []
    let minDate: string | null = null
    let maxDate: string | null = null

    for (const subject of subjects) {
      const schedule = await getSchedule(teacherNames, subject.name)
      console.warn(`Получено расписание для предмета ${subject.name}:`, schedule)

      // Фильтруем расписание по выбранным неделям
      const filteredSchedule: Schedule = {}
      for (const week of selectedWeeks) {
        if (schedule[week]) {
          filteredSchedule[week] = schedule[week]
        }
      }

      const { events, minDate: subjectMinDate, maxDate: subjectMaxDate } = createCalendarEvents(filteredSchedule)
      allEvents = allEvents.concat(events)

      if (!minDate || (subjectMinDate && new Date(subjectMinDate) < new Date(minDate))) {
        minDate = subjectMinDate
      }
      if (!maxDate || (subjectMaxDate && new Date(subjectMaxDate) > new Date(maxDate))) {
        maxDate = subjectMaxDate
      }
    }

    console.warn(`Создано ${allEvents.length} событий. minDate: ${minDate}, maxDate: ${maxDate}`)
    saveCalendar(allEvents, minDate, maxDate, teacherNames.join('_'))
    return subjects
  }
  catch (error) {
    console.error('Ошибка:', error)
    throw error
  }
}

export const getAvailableWeeks = async (teacherName: string): Promise<string[]> => {
  const subjects = await getSubjects(teacherName)
  const weeksSet = new Set<string>()

  for (const subject of subjects) {
    const schedule = await getSchedule(teacherName, subject.name)
    for (const week in schedule) {
      weeksSet.add(week)
    }
  }

  return Array.from(weeksSet)
}
