/* Переключатель темы: светлая / тёмная.
   Скрипт подключается в <head> без defer, чтобы выбранная тема
   применилась до первой отрисовки и не было вспышки. */
(function () {
  const STORAGE_KEY = "theme";
  const root = document.documentElement;
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function storedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      /* приватный режим или отключённое хранилище */
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* нечего сохранять — тема просто не запомнится */
    }
  }

  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      root.dataset.theme = theme;
    } else {
      delete root.dataset.theme;
    }
    updateButton();
  }

  function currentTheme() {
    if (root.dataset.theme === "light" || root.dataset.theme === "dark") {
      return root.dataset.theme;
    }
    return darkQuery.matches ? "dark" : "light";
  }

  function updateButton() {
    const button = document.querySelector("[data-theme-toggle]");

    if (!button) {
      return;
    }

    const isDark = currentTheme() === "dark";

    /* Имя кнопки не меняется — состояние передаётся через aria-pressed,
       иначе скринридер объявляет "Включить светлую тему, нажато". */
    button.setAttribute("aria-label", "Тёмная тема");
    button.setAttribute(
      "title",
      isDark ? "Включить светлую тему" : "Включить тёмную тему",
    );
    button.setAttribute("aria-pressed", String(isDark));
  }

  /* Тема из хранилища применяется сразу, до отрисовки страницы */
  applyTheme(storedTheme());

  document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector("[data-theme-toggle]");

    updateButton();

    if (button) {
      button.addEventListener("click", function () {
        const next = currentTheme() === "dark" ? "light" : "dark";

        saveTheme(next);
        applyTheme(next);
      });
    }

    /* Пока тема не выбрана вручную, следуем за системной настройкой */
    darkQuery.addEventListener("change", function () {
      if (!storedTheme()) {
        updateButton();
      }
    });
  });
})();
