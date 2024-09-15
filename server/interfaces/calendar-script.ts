export interface Lesson {
    time: string;
    date: string;
    group_class: string;
    auditorium: string;
    subject: string;
    teacher: string;
    kurse: string;
}

export interface Schedule {
    [week: string]: {
        [date: string]: Lesson[];
    };
}
