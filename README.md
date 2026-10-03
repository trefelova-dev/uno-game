# UNO Game

Интерактивная браузерная реализация карточной игры UNO на React и TypeScript.

---

## 🇷🇺 Русский

Браузерная игра против трёх ИИ-ботов. Проект ориентирован на чистую архитектуру игрового состояния через конечный автомат без рассинхронизации ходов и лишних ререндеров.

### Особенности
* Поддержка всех спецкарт — Пропуск хода (`Skip`), Смена направления (`Reverse`), Возьми две (`+2`), Дикая карта с выбором цвета (`Wild`) и Дикая карта со штрафом (`Wild +4`).
* 3 автоматизированных бота со встроенной оценкой стола и принятием решений.
* Задержки ходов для читаемости темпа, анимация вылета карт из колоды и приземления в стопку сброса под случайным углом, подсветка активного игрока.
* Состояние матча и валидация действий обрабатываются через `useReducer`.

### Локальный запуск
1. Клонировать репозиторий:
   ```bash
   git clone https://github.com/trefelova-dev/uno-game.git
   cd uno-game
   ```

2. Установить зависимости:
   ```bash
   npm install
   ```

3. Запустить режим разработки:
   ```bash
   npm run dev
   ```

### Стек технологий
* React 18
* TypeScript
* Tailwind CSS
* Vite

---

## 🇬🇧 English

A web-based UNO card game built with React and TypeScript featuring 3 AI opponents.

### Features
* Full support for `Skip`, `Reverse`, `Draw Two (+2)`, `Wild`, and `Wild Draw Four (+4)`.
* 3 automated opponents with contextual card selection and color picking.
* Step-by-step turn delays, CSS-accelerated deck draws, dynamic discard pile scatter, and active turn indicators.
* Centralized game loop and turn validation powered by React `useReducer`.

### Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/trefelova-dev/uno-game.git
   cd uno-game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   
3. Run dev server:
   ```bash
   npm run dev
   ```

### Tech Stack
* React 18
* TypeScript
* Tailwind CSS
* Vite