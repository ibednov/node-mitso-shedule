const axios = require('axios');
const fs = require('fs');
const ics = require('ics');
const path = require('path');

const teacherName = 'Беднов А. О.';
const teacherNameEncoded = encodeURIComponent(teacherName);

const getSubjects = async () => {
    const response = await axios.get(`https://apps.mitso.by/frontend/web/schedule/teacher-subjects?teacher=${teacherNameEncoded}`);
    return response.data;
};

const getSchedule = async (subject) => {
    const subjectEncoded = encodeURIComponent(subject);
    const response = await axios.get(`https://apps.mitso.by/frontend/web/schedule/teacher-subject-schedules?teacher=${teacherNameEncoded}&subject=${subjectEncoded}`);
    return response.data;
};

const createCalendarEvents = (schedule) => {
    const events = [];
    let minDate = null;
    let maxDate = null;

    for (const week in schedule) {
        for (const date in schedule[week]) {
            if (!minDate || new Date(date) < new Date(minDate)) {
                minDate = date;
            }
            if (!maxDate || new Date(date) > new Date(maxDate)) {
                maxDate = date;
            }

            schedule[week][date].forEach((lesson) => {
                const [startHour, startMinute] = lesson.time.split(' - ')[0].split(':');
                const [endHour, endMinute] = lesson.time.split(' - ')[1].split(':');
                const [year, month, day] = lesson.date.split('-');

                events.push({
                    start: [parseInt(year), parseInt(month), parseInt(day), parseInt(startHour), parseInt(startMinute)],
                    end: [parseInt(year), parseInt(month), parseInt(day), parseInt(endHour), parseInt(endMinute)],
                    title: `${lesson.group_class} / ${lesson.auditorium} / ${lesson.subject}`,
                    description: `${lesson.subject} с ${lesson.teacher} в аудитории ${lesson.auditorium}\nГруппа: ${lesson.group_class}\nКурс: ${lesson.kurse}`,
                    location: lesson.auditorium,
                    status: 'CONFIRMED',
                    busyStatus: 'BUSY',
                });
            });
        }
    }

    return { events, minDate, maxDate };
};

const saveCalendar = (events, minDate, maxDate) => {
    // если папку не нашло - надо создать
    if (!fs.existsSync(path.join(__dirname, '../results'))) {
        fs.mkdirSync(path.join(__dirname, '../results'));
    }
    ics.createEvents(events, (error, value) => {
        if (error) {
            console.log(error);
            return;
        }
        const fileName = `calendar_${minDate}_to_${maxDate}.ics`;
        const filePath = path.join(__dirname, '../results', fileName);
        fs.writeFileSync(filePath, value);
        console.log(`Файл календаря создан: ${filePath}`);
    });
};

const main = async () => {
    try {
        const subjects = await getSubjects();
        let allEvents = [];
        let minDate = null;
        let maxDate = null;

        for (const subject of subjects) {
            const schedule = await getSchedule(subject.name);
            const { events, minDate: subjectMinDate, maxDate: subjectMaxDate } = createCalendarEvents(schedule);
            allEvents = allEvents.concat(events);

            if (!minDate || new Date(subjectMinDate) < new Date(minDate)) {
                minDate = subjectMinDate;
            }
            if (!maxDate || new Date(subjectMaxDate) > new Date(maxDate)) {
                maxDate = subjectMaxDate;
            }
        }

        saveCalendar(allEvents, minDate, maxDate);
    } catch (error) {
        console.error('Ошибка:', error);
    }
};

main();
