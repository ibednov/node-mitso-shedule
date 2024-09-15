# Node Mitso Schedule

Этот проект предназначен для создания календаря на основе расписания преподавателя из системы MITSO.

## Структура проекта

- `scripts/` - папка, содержащая скрипты.
- `results/` - папка, в которую сохраняются результаты выполнения скриптов.

## Установка

1. Клонируйте репозиторий:

    ```bash
    git clone https://github.com/ibednov/node-mitso-schedule.git
    cd node-mitso-schedule
    ```

2. Установите зависимости:

    ```bash
    bun install
    ```

    ```bash
    pnpm install
    ```

    ```bash
    npm install
    ```

## Использование

1. Запустите скрипт для создания календаря:

    ```bash
    node scripts/calendar-script.js
    ```

2. После выполнения скрипта, файл календаря будет создан в папке `results`.


## Требования

- Node.js
- packet manager (например, Bun)

## Зависимости

- [axios](https://www.npmjs.com/package/axios) - для выполнения HTTP-запросов.
- [ics](https://www.npmjs.com/package/ics) - для создания файлов календаря.
- [fs](https://nodejs.org/api/fs.html) - для работы с файловой системой.

## Лицензия

Этот проект лицензирован под лицензией MIT. Подробности смотрите в файле [LICENSE](LICENSE).
