# Legal AI Platform — README

## Обзор

Legal AI Platform — это веб-приложение, разработанное для оказания юридической помощи пользователям посредством взаимодествия с искусственным интеллектом.

## Функции

* Регистрация/Войти
* Профиль юзера (аватар, имя, email)
* Чат с искусственным интеллектом
* Скачивание и хранение документов
* Шаблоны документов
* Система оплаты (счёта, баланс)

## Технологии

* **Next.js (App Router)**
* **TypeScript**
* **Tailwind CSS**
* **PostgreSQL** + Prisma ORM
* **FastAPI (Python)**
* **JWT Auth (access + refresh)**
* **OpenAI API**
* **WebSockets (audio streaming)**

## Установка

```bash
pnpm install
pnpm dev
```

### Сервер

FastAPI backend развёртывается отдельно. Подробности в `/backend/README.md`

## Конфигурация

.env:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws/asr
OPENAI_API_KEY=...
```
