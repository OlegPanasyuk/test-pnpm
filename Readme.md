Крутая цель 👌 Давай по шагам: GitHub Actions + pnpm + тесты + кэш.

Я буду писать примеры на YAML, ты сможешь их просто вставить в `.github/workflows/ci.yml`.

---

## 1. Базовый workflow с pnpm и тестами

Создай файл:
`.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm' # вкл. кэш для pnpm (node_modules + store)

      - name: Install pnpm
        run: |
          corepack enable
          corepack prepare pnpm@latest --activate

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run tests
        run: pnpm test
```

Что здесь важно:

* `actions/setup-node@v4` с `cache: 'pnpm'` — это **автоматический кэш**.
* `corepack` включает pnpm (рекомендуемый способ вместо прямого `npm i -g pnpm`).
* `pnpm install --frozen-lockfile` — чтобы сборка была детерминированной.

---

## 2. Как работает кэш с pnpm (простое объяснение)

С `cache: 'pnpm'` GitHub сам:

* хеширует:

  * версию Node.js,
  * содержимое `pnpm-lock.yaml`,
* кэширует внутреннее хранилище pnpm (store), из которого уже собираются `node_modules`.

Поведение:

* Если **lockfile не менялся** → кэш хит → `pnpm install` работает сильно быстрее.
* Если **обновились зависимости** → хеш меняется → новый кэш, старый больше не используется.

---

## 3. Если хочешь прям сам контролировать кэш

Иногда хочется самому управлять ключом кэша, чтобы лучше понимать, что происходит.

```yaml
jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install pnpm
        run: |
          corepack enable
          corepack prepare pnpm@latest --activate

      - name: Get pnpm store path
        id: pnpm-store
        run: echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT

      - name: Cache pnpm store
        uses: actions/cache@v4
        with:
          path: ${{ steps.pnpm-store.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run tests
        run: pnpm test
```

Тут:

* `pnpm store path` → узнаём путь к store.
* `actions/cache@v4` → кэшируем именно store.
* Ключ кэша завязан на `pnpm-lock.yaml`, как и в автокэше.

Обычно **хватает варианта №1** с `cache: 'pnpm'`. Вариант №2 нужен, если ты хочешь тонко настраивать разные кэши (например, для e2e, build и т.п.).

---

## 4. Как посмотреть, работает ли кэш

В UI GitHub Actions в логе шагов:

* при автокэше (`cache: 'pnpm'`) будут строки типа:

  * `Cache restored from key: ...`
  * `Cache not found for input keys: ...`
* при `actions/cache`:

  * `Cache restored successfully`
  * `Cache not found`

Также ты заметишь по времени:

* первый запуск: `pnpm install` может занимать, например, 30–60+ сек,
* при удачном кэше — значительно меньше.

---

## 5. Частые мелкие нюансы

* Не забывай класть в репо `pnpm-lock.yaml`.
* Если меняешь версию Node → кэш может инвалидироваться (и это нормально).
* Команда тестов:

  * если у тебя `scripts` в `package.json`, например `"test": "vitest"` или `"test": "jest"`, то `pnpm test` уже ок.
  * если другое название, поменяй шаг:

    ```yaml
    - name: Run tests
      run: pnpm run my-test-script
    ```

---

Если хочешь, скинь свой `package.json` и/или текущий workflow — могу прям точечно подправить под твой проект.
