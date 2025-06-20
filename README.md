# Проект "Управление Полигонами"

## Описание Проекта

Этот проект представляет собой веб-приложение для создания, управления и взаимодействия с геометрическими полигонами. Приложение включает в себя буферную зону для хранения созданных полигонов и рабочую зону, куда полигоны можно перетаскивать для дальнейшей работы. Реализована функциональность drag-and-drop, масштабирования (зум) и панорамирования рабочей области.

Основные возможности:

- Создание случайных полигонов с уникальными цветами (из заданного набора).
- Перетаскивание полигонов из буферной зоны в рабочую область.
- Масштабирование и панорамирование рабочей зоны для удобной работы с полигонами.
- Сохранение и загрузка состояния буферной и рабочей зон в Local Storage браузера.
- Сброс данных.
- Обработка ошибок при перетаскивании.

Проект использует LitElement для построения пользовательского интерфейса в виде веб-компонентов.

## Как Запустить Проект

Для запуска проекта локально выполните следующие шаги:

1.  **Клонируйте репозиторий** (если применимо, или убедитесь, что у вас есть все файлы проекта).

2.  **Перейдите в корневую директорию проекта** в терминале:
    ```bash
    cd /c%3A/Frontend/tasks/polygon-app
    ```

3.  **Установите зависимости**. Убедитесь, что у вас установлен Node.js и npm (или yarn). Затем выполните команду:
    ```bash
    npm install
    ```
    или
    ```bash
    yarn install
    ```

4.  **Запустите проект**. Обычно проекты на LitElement/веб-компонентах запускаются с помощью dev-сервера. В зависимости от конфигурации проекта, команда может отличаться, но часто используется:
    ```bash
    npm start
    ```
    или
    ```bash
    yarn start
    ```
    Проверьте `package.json` файл на наличие скриптов запуска (`scripts`). Ищите скрипт типа `start` или `dev`.

5.  **Откройте приложение в браузере**. После запуска dev-сервера приложение будет доступно по адресу, указанному в выводе команды запуска (обычно `http://localhost:8000` или похожий).

Теперь вы можете взаимодействовать с приложением, создавать полигоны, перетаскивать их и использовать функции сохранения/загрузки.
