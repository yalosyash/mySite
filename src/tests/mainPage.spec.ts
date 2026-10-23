import { test, expect, Page } from "@playwright/test";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { elements, aboutSection } from "./ts/elements/elements";

/**
 * Эталоны скриншотов привязаны к платформе (win32/linux), поэтому в репозитории
 * они появляются не сразу. Пока для текущей платформы эталона нет, тест
 * пропускается, а не падает: основной CI остаётся зелёным, а сгенерировать
 * недостающие эталоны можно воркфлоу "Update Linux Snapshots".
 */
function snapshotPath(
  testInfo: {
    project: { name: string };
  },
  name: string,
): string {
  return join(
    __dirname,
    "mainPage.spec.ts-snapshots",
    `${name}-${testInfo.project.name}-${process.platform}.png`,
  );
}

/**
 * Запущен ли прогон в режиме обновления эталонов (`--update-snapshots` / `-u`).
 *
 * Читаем `updateSnapshots` из конфига теста, а не из `process.argv`: воркер
 * Playwright запускается отдельным процессом, где `argv` содержит только путь
 * к node и к самому Playwright — флагов CLI там нет. При обычном прогоне
 * значение равно "missing", при `--update-snapshots` — "missing" тоже
 * (флаг без значения), поэтому отличаем их по "all" и "changed".
 */
function isUpdatingSnapshots(testInfo: {
  config: { updateSnapshots: string };
}): boolean {
  return testInfo.config.updateSnapshots !== "missing";
}

function skipIfNoBaseline(
  testInfo: {
    project: { name: string };
    config: { updateSnapshots: string };
  },
  name: string,
): void {
  test.skip(
    !isUpdatingSnapshots(testInfo) && !existsSync(snapshotPath(testInfo, name)),
    `Нет эталона для платформы ${process.platform}. Запустите "Update Linux Snapshots" в GitHub Actions и закоммитьте артефакт.`,
  );
}

async function openPage(page: Page): Promise<void> {
  await page.route("https://mc.yandex.ru/**", (route) => route.abort());
  await page.goto("", { waitUntil: "domcontentloaded" });
}

test.beforeEach(async ({ page }) => {
  await openPage(page);
});

test.describe("Отображение страницы", () => {
  test("Отображение элементов страницы", async ({ page }) => {
    for (const { locator, name } of elements) {
      await test.step(name, async () => {
        await expect(locator(page), name).toBeVisible();
      });
    }
  });

  test("Отображение текста элементов страницы", async ({ page }) => {
    for (const { locator, name, text, innerText } of elements) {
      if (text) {
        await test.step(name, async () => {
          await expect(locator(page), name).toHaveText(text, {
            useInnerText: innerText,
          });
        });
      }
    }
  });
});

test.describe("Сравнение ссылок в списке ссылок", () => {
  test("Присутствие атрибутов href в ссылках", async ({ page }) => {
    for (const { locator, name, attribute } of elements) {
      if (attribute) {
        await test.step(name, async () => {
          await expect(locator(page), name).toHaveAttribute(
            attribute.type,
            attribute.value,
          );
        });
      }
    }
  });

  test("Внешние ссылки открываются безопасно", async ({ page }) => {
    const links = page.locator('.link[target="_blank"]');
    const count = await links.count();

    expect(count).toBeGreaterThan(0);

    for (let index = 0; index < count; index += 1) {
      await test.step(`Ссылка #${index + 1}`, async () => {
        const link = links.nth(index);
        await expect(link).toHaveAttribute("rel", /noopener/);
        await expect(link).toHaveAttribute("rel", /noreferrer/);
      });
    }
  });
});

test.describe("Секция 'Обо мне'", () => {
  test("Содержимое видно сразу, без раскрытия", async ({ page }) => {
    await expect(aboutSection(page)).toBeVisible();
    await expect(page.getByText("более 500 автотестов")).toBeVisible();
    await expect(page.getByText("визуальную регрессию Canvas")).toBeVisible();
  });

  test("Секция идёт перед блоком контактов", async ({ page }) => {
    /* Сравниваем порядок в DOM, а не координаты: на широком экране блоки
       стоят в две колонки, и вертикальные позиции у них совпадают. */
    const order = await page.evaluate(() => {
      const about = document.querySelector("section.about");
      const contacts = document.querySelector(".contacts");

      if (!about || !contacts) {
        return null;
      }

      const position = about.compareDocumentPosition(contacts);

      return position === Node.DOCUMENT_POSITION_FOLLOWING;
    });

    expect(order, "«Обо мне» должна идти раньше контактов").toBe(true);
  });

  test("В секции есть стек технологий и статус поиска", async ({ page }) => {
    const stack = page.getByRole("list", { name: "Технологии" });

    await expect(stack).toBeVisible();
    await expect(stack.getByText("Java", { exact: true })).toBeVisible();
    await expect(stack.getByText("Selenide", { exact: true })).toBeVisible();
    await expect(stack.getByText("Postman", { exact: true })).toBeVisible();
    await expect(page.getByText(/Рассматриваю предложения/)).toBeVisible();
  });

  test("Контакты видны на первом экране", async ({ page }) => {
    /* Смысл переноса секции наверх: посетитель сразу видит и «кто я»,
       и куда писать. Если контакты уедут под сгиб, вариант теряет смысл. */
    const viewport = page.viewportSize();
    const firstLink = page.locator(".link").first();

    await expect(firstLink).toBeInViewport();

    const box = await firstLink.boundingBox();

    expect(viewport).not.toBeNull();
    expect(box!.y).toBeLessThan(viewport!.height);
  });
});

test.describe("Футер", () => {
  test("Год берётся из системной даты", async ({ page }) => {
    await page.clock.install({ time: new Date("2031-05-15T10:00:00Z") });
    await openPage(page);

    const year = page.locator("#year");

    await expect(year).toHaveText("2031");
    await expect(year).toHaveAttribute("datetime", "2031");
    await expect(page.locator(".site-footer")).toContainText(
      "© 2031 Владислав Клепиков",
    );
  });

  test("Без JavaScript год всё равно отображается", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await openPage(page);

    await expect(page.locator("#year")).toHaveText(/^\d{4}$/);
    await expect(page.locator(".site-footer")).toContainText(
      "Владислав Клепиков",
    );

    await context.close();
  });
});

test.describe("Переключатель темы", () => {
  const toggle = (page: Page) => page.locator("[data-theme-toggle]");

  test("По умолчанию тема следует за системной", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await openPage(page);

    await expect(toggle(page)).toBeVisible();
    await expect(toggle(page)).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.*/);
    await expect(toggle(page)).toHaveAttribute("title", "Включить тёмную тему");
  });

  test("Системная тёмная тема включает тёмное оформление", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await openPage(page);

    await expect(toggle(page)).toHaveAttribute("aria-pressed", "true");
    await expect(toggle(page)).toHaveAttribute(
      "title",
      "Включить светлую тему",
    );
  });

  test("Клик переключает тему и запоминает выбор", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await openPage(page);

    const html = page.locator("html");

    await expect(html).not.toHaveAttribute("data-theme", /.*/);

    await toggle(page).click();
    await expect(html).toHaveAttribute("data-theme", "dark");
    await expect(toggle(page)).toHaveAttribute("aria-pressed", "true");

    await toggle(page).click();
    await expect(html).toHaveAttribute("data-theme", "light");
    await expect(toggle(page)).toHaveAttribute("aria-pressed", "false");
  });

  test("Выбранная тема переживает перезагрузку", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await openPage(page);

    await toggle(page).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.reload();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(toggle(page)).toHaveAttribute("aria-pressed", "true");
  });

  test("Выбор пользователя важнее системной темы", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await openPage(page);

    /* Система тёмная, пользователь переключает на светлую */
    await toggle(page).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await page.reload();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(toggle(page)).toHaveAttribute("aria-pressed", "false");
  });

  test("Переключатель доступен с клавиатуры", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await openPage(page);

    await toggle(page).focus();
    await page.keyboard.press("Enter");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});

test.describe("Прокрутка", () => {
  test("При перезагрузке страница не прокручивается вниз", async ({ page }) => {
    /* Фиксируем самый глубокий скролл за всю перезагрузку, а не только
       итоговое значение: скачок происходит во время анимации появления
       карточки, которую Chromium принимает за сдвиг контента и
       компенсирует автоматической прокруткой. Проба ставится через
       addInitScript, иначе она исчезнет вместе с документом при reload. */
    await page.addInitScript(() => {
      const state = { max: 0 };

      (window as unknown as { __scrollProbe: typeof state }).__scrollProbe =
        state;

      const t0 = performance.now();
      const tick = (): void => {
        state.max = Math.max(state.max, Math.round(window.scrollY));
        if (performance.now() - t0 < 2000) {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
    });

    await openPage(page);
    await page.waitForTimeout(300);
    await page.evaluate(() => window.scrollTo(0, 0));

    await page.reload({ waitUntil: "load" });
    await page.waitForTimeout(1200);

    const probe = await page.evaluate(
      () =>
        (window as unknown as { __scrollProbe?: { max: number } }).__scrollProbe
          ?.max ?? 0,
    );

    expect(probe, "страница не должна уезжать вниз при перезагрузке").toBe(0);
  });
});

test.describe("Скриншоты страницы", () => {
  test("Отображение страницы", async ({ page }, testInfo) => {
    skipIfNoBaseline(testInfo, "page");

    await expect(page).toHaveScreenshot("page.png");
  });

  test("Отображение секции «Обо мне»", async ({ page }, testInfo) => {
    skipIfNoBaseline(testInfo, "aboutSection");

    await expect(aboutSection(page)).toHaveScreenshot("aboutSection.png");
  });
});
