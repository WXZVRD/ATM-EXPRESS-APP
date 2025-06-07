# 🏧 Player ATM Service

Сервис для управления банковскими операциями игроков: проверка баланса, пополнение, снятие средств, история транзакций и переводы между игроками.

---

## 🚀 Стек технологий

- **Node.js**
- **TypeScript**
- **Express**
- **PostgreSQL (pg)**
- **JSDoc**

---

## 📁 Структура проекта
src/

├── controllers/ # Express-контроллеры

├── models/ # Модели данных (Player, Transaction)

├── repository/ # Репозитории для работы с БД

├── services/ # ATM-сервис с бизнес-логикой

├── routes/ # Express-роутинг

├── database/ # Инициализация подключения к БД

├── types/ # Общие типы (UUID и др.)

└── index.ts # Точка входа



 <h1>📌 Возможности</h1>
💰 Проверка и изменение баланса

🔒 Транзакции с поддержкой транзакционности (BEGIN / COMMIT / ROLLBACK)

🔄 Переводы между игроками

📜 История операций

🧪 Простой и чистый код с TypeScript типами



---

## ⚙️ Установка

1. **Клонируй репозиторий:**

```bash
git clone https://github.com/WXZVRD/ATM-EXPRESS-APP.git
cd player-atm-service
Установи зависимости:

npm install
Настрой базу данных (PostgreSQL):

Создай базу данных и таблицы:

CREATE TABLE players (
  id UUID PRIMARY KEY,
  name TEXT,
  balance NUMERIC DEFAULT 0
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  from_player UUID,
  to_player UUID,
  amount NUMERIC,
  type TEXT CHECK (type IN ('deposit', 'withdraw', 'transfer')),
  created_at TIMESTAMP DEFAULT now()
);

INSERT INTO players (id, username)
VALUES ('6e449016-d04c-4c83-a62a-13a8e376d7e1', 'Tyraellis');

INSERT INTO players (id, username)
VALUES ('20255a2c-7612-47a0-a0d9-6deb6fe0a5d8', 'Lakalutnasha');

Настрой .env:

Создай файл .env и укажи параметры подключения:

env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=atm_db

🧪 Запуск проекта
npm run dev   # для разработки
npm run build # сборка
npm start     # запуск собранного проекта
