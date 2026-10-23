## Мой сайт визитка [![Playwright Tests](https://github.com/yalosyash/mySite/actions/workflows/playwright.yml/badge.svg)](https://github.com/yalosyash/mySite/actions/workflows/playwright.yml)

Сайт-визитка QA инженера: контакты, резюме и короткий рассказ о себе.

Технологии:

- HTML
- CSS (custom properties, `clamp()`, Grid, `[open]`, тёмная тема)
- SVG-спрайт для иконок
- TypeScript
- Playwright

## Структура

```
index.html                    # страница
src/main/css/styles.css       # стили (светлая/тёмная тема, адаптив)
src/main/assets/avatar.png    # аватар
src/main/assets/icons.svg     # спрайт иконок (<symbol> + <use>)
src/main/js/theme.js          # переключатель светлой/тёмной темы
src/main/js/footer-year.js    # подставляет текущий год в футере
src/main/js/metrika.js        # счётчик Яндекс.Метрики
src/tests/                    # Playwright-тесты и эталонные скриншоты
```

Сайт статический: сборка не нужна. Блок «Обо мне» — обычная секция, которая
видна сразу; иконки подключаются из SVG-спрайта, а год в футере подставляет
`footer-year.js` (в разметке остаётся запасное значение на случай без JS).

## Темы

Тема по умолчанию берётся из системной настройки (`prefers-color-scheme`).
Кнопка в правом верхнем углу карточки переключает светлую и тёмную явно;
выбор сохраняется в `localStorage` и важнее системной настройки. Скрипт
подключён в `<head>` без `defer`, чтобы тема применилась до первой отрисовки.
Без JavaScript работает только системная тема.

## Запуск

```bash
npm install
npx http-server . -p 4173   # http://localhost:4173
```

## Тесты

```bash
npm test                      # все тесты
npm run test:ui               # интерактивный режим
npm run test:update-screenshots
npm run lint
npm run format
```

UI покрыт тестами на платформе [Playwright](https://playwright.dev/): видимость
и текст элементов, адреса ссылок и `rel` у внешних ссылок, наличие секции
«Обо мне» и её порядок относительно контактов, скриншот-сравнение страницы и
этой секции.

## Эталоны скриншотов

Эталоны привязаны к платформе (`-win32.png`, `-linux.png`). Windows-эталоны
обновляются локально:

```bash
npx playwright test --grep "Скриншоты" --update-snapshots
```

Linux-эталоны генерируются в CI воркфлоу **Update Linux Snapshots**
(Actions → Run workflow). Скачайте артефакт `linux-snapshots`, распакуйте в
`src/tests/mainPage.spec.ts-snapshots` и закоммитьте. Пока эталона для
платформы нет, скриншот-тест помечается как skipped, а не падает.
