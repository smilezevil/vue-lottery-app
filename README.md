# Vue Lottery App

Односторінковий застосунок для проведення лотереї та керування її учасниками.
Дані користувачів беруться з [DummyJSON](https://dummyjson.com).

**Стек:** Vue 3 (Composition API, `<script setup>`), TypeScript, Vue Router, Pinia,
PrimeVue (тема Aura), VeeValidate + Zod, SCSS, Vite, ESLint, Steiger.

## Запуск

```sh
npm install
npm run dev        # режим розробки
npm run build      # перевірка типів і збірка
npm run lint       # oxlint + ESLint + Steiger (lint:fsd)
npm run lint:fsd   # лише перевірка правил Feature-Sliced Design
```

Адреса API задається у файлі `.env`:

```
VITE_API_URL=https://dummyjson.com
```

## Архітектура: Feature-Sliced Design

```
src/
├── app/        # запуск: main.ts, App.vue, layouts, router + guards, Pinia, PrimeVue, реєстрація сервісів
├── pages/      # home, about, users, user-details, user-create, login, not-found
├── widgets/    # app-header, users-table
├── features/   # auth, user-form, user-delete, pick-winner, theme-toggle
├── entities/   # user (типи, UserService, users store), session (AuthService, session store)
└── shared/     # api (http-client, Repository, ServiceProvider), config, ui (обгортки PrimeVue)
```

Кожен слайс відкриває назовні лише свій Public API (`index.ts`).
Глибокі імпорти та імпорти «вгору» по шарах перевіряють ESLint (`no-restricted-imports`) і Steiger.

### Залежності між шарами

Модуль може імпортувати тільки з шарів, що розташовані нижче.

```mermaid
flowchart TD
    APP["app"]
    PAGES["pages"]
    WIDGETS["widgets"]
    FEATURES["features"]
    ENTITIES["entities"]
    SHARED["shared"]

    APP --> PAGES
    APP --> WIDGETS
    APP --> FEATURES
    APP --> ENTITIES
    APP --> SHARED
    PAGES --> WIDGETS
    PAGES --> FEATURES
    PAGES --> ENTITIES
    PAGES --> SHARED
    WIDGETS --> FEATURES
    WIDGETS --> ENTITIES
    WIDGETS --> SHARED
    FEATURES --> ENTITIES
    FEATURES --> SHARED
    ENTITIES --> SHARED
```

### Залежності між слайсами

```mermaid
flowchart LR
    subgraph pagesLayer["pages"]
        pageUsers["users"]
        pageDetails["user-details"]
        pageCreate["user-create"]
        pageLogin["login"]
    end
    subgraph widgetsLayer["widgets"]
        widgetHeader["app-header"]
        widgetTable["users-table"]
    end
    subgraph