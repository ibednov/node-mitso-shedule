import axios from 'axios';
import fs from 'fs';
import { createEvents, EventAttributes } from 'ics';
import path from 'path';
import { config } from 'dotenv';

config(); // Загружаем переменные окружения из .env

const apiBaseUrl: string = process.env.API_BASE_URL!;
const teacherName: string = process.env.TEACHER_NAME!;
const teacherNameEncoded: string = encodeURIComponent(teacherName);

interface Lesson {
    time: string;
    date: string;
    group_class: string;
    auditorium: string;
    subject: string;
    teacher: string;
    kurse: string;
}

interface Schedule {
    [week: string]: {
        [date: string]: Lesson[];
    };
}

const getSubjects = async (): Promise<{ name: string }[]> => {
    const response = await axios.get(`${apiBaseUrl}/teacher-subjects?teacher=${teacherNameEncoded}`);
    return response.data;
};

const getSchedule = async (subject: string): Promise<Schedule> => {
    const subjectEncoded: string = encodeURIComponent(subject);
    const response = await axios.get(`${apiBaseUrl}/teacher-subject-schedules?teacher=${teacherNameEncoded}&subject=${subjectEncoded}`);
    return response.data;
};

const createCalendarEvents = (schedule: Schedule): { events: EventAttributes[], minDate: string | null, maxDate: string | null } => {
    const events: EventAttributes[] = [];
    let minDate: string | null = null;
    let maxDate: string | null = null;

    for (const week in schedule) {
        for (const date in schedule[week]) {
            if (!minDate || new Date(date) < new Date(minDate)) {
                minDate = date;
            }
            if (!maxDate || new Date(date) > new Date(maxDate)) {
                maxDate = date;
            }

            schedule[week][date].forEach((lesson) => {
                const [startHour, startMinute] = lesson.time.split(' - ')[0].split(':').map(Number);
                const [endHour, endMinute] = lesson.time.split(' - ')[1].split(':').map(Number);
                const [year, month, day] = lesson.date.split('-').map(Number);

                events.push({
                    start: [year, month, day, startHour, startMinute],
                    end: [year, month, day, endHour, endMinute],
                    title: `${lesson.group_class} / ${lesson.auditorium} / ${lesson.subject}`,
                    description: `${lesson.subject} с ${lesson.teacher} в аудитории ${lesson.audиторium}\nГруппа: ${lesson.group_class}\nКурс: ${lesson.kurse}`,
                    location: lesson.auditorium,
                    status: 'CONFIRMED',
                    busyStatus: 'BUSY',
                });
            });
        }
    }

    return { events, minDate, maxDate };
};

const saveCalendar = (events: EventAttributes[], minDate: string | null, maxDate: string | null): void => {
    if (!fs.existsSync(path.join(__dirname, '../results'))) {
        fs.mkdirSync(path.join(__dirname, '../results'));
    }
    createEvents(events, (error, value) => {
        if (error) {
            console.log(error);
            return;
        }
        const fileName = `calendar_${minDate}_to_${maxDate}.ics`;
        const filePath = path.join(__dirname, '../results', fileName);
        fs.writeFileSync(filePath, value);
        console.log(`Файл календаря создан: $scripts/calendar-script.ts`);
    });
};

const main = async (): Promise<void> => {
    try {
        const subjects = await getSubjects();
        let allEvents: EventAttributes[] = [];
        let minDate: string | null = null;
        let maxDate: string | null = null;

        for (const subject of subjects) {
            const schedule = await getSchedule(subject.name);
            const { events, minDate: subjectMinDate, maxDate: subjectMaxDate } = createCalendarEvents(schedule);
            allEvents = allEvents.concat(events);

            if (!minDate || new Date(subjectMinDate!) < new Date(minDate)) {
                minDate = subjectMinDate;
            }
            if (!maxDate || new Date(subjectMaxDate!) > new Date(maxDate)) {
                maxDate = subjectMaxDate;
            }
        }

        saveCalendar(allEvents, minDate, maxDate);
    } catch (error) {
        console.error('Ошибка:', error);
    }
};

main();
