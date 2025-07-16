# areal-hr_ext-test
Тестовое задание в AREAL на Vue.js и Nest.js

## Инструкция по запуску
**1. Установка зависимостей**
```bash
    cd api
    npm install
    # или если используется Yarn:
    yarn install
```
**2. Настройка окружения**
```text
    Создайте пустую базу данных в любой СУБД.
    Создайте файл .env и вбейте значения переменных для подключения к вашей бд:
    PG_USER=
    PG_PASS=
    PG_HOST=
    PG_PORT=
    PG_DATABASE=
```
**3. Запуск БД в Docker**
```bash
    docker-compose up
```
**4. Запуск проекта**
#### Для разработки (с hot-reload):
```bash
    npm run start:dev
    # или
    yarn start:dev
```
#### Для production:
###### Сначала соберите проект:
```bash
    npm run build
    # или
    yarn build
```
###### Затем запустите:
```bash
    npm run start:prod
    # или
    yarn start:prod
```
**5. Проверка работы**
##### Откройте в браузере (/docs - swagger API для тестов):
http://localhost:3000/docs