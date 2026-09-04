# Emotional View

Emotional View — система мониторинга эмоциональных реакций по изображению с камеры. Проект объединяет веб-интерфейс, REST API, модуль машинного обучения, PostgreSQL, Redis и стек наблюдаемости на базе Prometheus и Grafana.

## Возможности

- распознавание выражений лица в браузере;
- сбор и обработка результатов эмоционального анализа;
- управление пользователями, ролями, группами и устройствами Raspberry Pi;
- просмотр статистики и графиков в веб-интерфейсе;
- мониторинг сервисов и контейнеров.

## Технологии

- **Frontend:** React, TypeScript, Vite, Redux Toolkit, Mantine, Chart.js, face-api.js;
- **Backend:** Python, FastAPI, SQLAlchemy;
- **ML:** TensorFlow, Keras, scikit-learn;
- **Data:** PostgreSQL, Redis;
- **Monitoring:** Prometheus, Grafana, Alertmanager, cAdvisor, Node Exporter;
- **Infrastructure:** Docker Compose.

## Структура проекта

```text
.
├── code/
│   ├── API/          # FastAPI-приложение и API для Raspberry Pi
│   ├── Frontend/     # React-приложение
│   ├── ML/           # обработка данных и ML-модель
│   ├── Monitoring/   # конфигурация Prometheus, Grafana и Alertmanager
│   ├── docker/       # Dockerfile для компонентов
│   └── docker-compose.yml
├── doc/              # техническая документация
└── Visio/            # схемы проекта
```

## Запуск

### Требования

- Docker;
- Docker Compose.

### 1. Настройте переменные окружения

Скопируйте файл-пример:

```bash
cp code/example.env.txt code/.env
```

Затем задайте собственные значения в `code/.env`. Этот файл содержит секреты и исключён из Git.

### 2. Запустите сервисы

```bash
cd code
docker compose up --build -d
```

### 3. Откройте приложение

- веб-интерфейс: <http://127.0.0.1:3000>;
- документация FastAPI: <http://127.0.0.1:8000/documentation>;
- Grafana через прокси frontend: <http://127.0.0.1:3000/grafana>;
- Prometheus через прокси frontend: <http://127.0.0.1:3000/prometheus>.

## Остановка

```bash
cd code
docker compose down
```

Чтобы также удалить созданные Docker-тома с данными:

```bash
docker compose down -v
```

## Документация

Дополнительные требования, функциональная модель и схемы находятся в каталогах `doc/` и `Visio/`.
