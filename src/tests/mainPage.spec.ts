import { test, expect, Page } from "@playwright/test";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { elements, aboutSummary, aboutDetails } from "./ts/elements/elements";
import { buttons } from "./ts/elements/buttons";

const snapshotNames: Record<string, string> = {
  "Обо мне": "AboutMe",
  Свернуть: "Collapse",
};

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
 * Значение `config.updateSnapshots` для этого не годится: по умолчанию оно
 * равно "missing" и в обычном прогоне тоже.
 */
function isUpdatingSnapshots(): boolean {
  return process.argv.some(
    (arg) => arg === "--update-snapshots" || arg === "-u",
  );
}

function skipIfNoBaseline(
  testInfo: { project: { name: string } },
  name: string,
): void {
  test.skip(
    !isUpdatingSnapshots() && !existsSync(snapshotPath(testInfo, name)),
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

test.describe("Работоспособность кнопки 'Обо мне'", () => {
  test("Секция 'Обо мне' скрыта по умолчанию", async ({ page }) => {
    await expect(aboutDetails(page)).not.toHaveAttribute("open", /.*/);
    await expect(page.getByText("Практикующий QA Automation")).toBeHidden();
  });

  test("Раскрытие и сворачивание секции 'Обо мне'", async ({ page }) => {
    const summary = aboutSummary(page);
    const details = aboutDetails(page);

    await summary.click();

    await expect(details).toHaveAttribute("open", /.*/);
    await expect(summary).toHaveText("Свернуть", { useInnerText: true });
    await expect(
      page.getByRole("region", { name: "Связь со мной" }),
    ).toBeVisible();
    await expect(page.getByText("Практикующий QA Automation")).toBeVisible();

    await summary.click();

    await expect(details).not.toHaveAttribute("open", /.*/);
    await expect(summary).toHaveText("Обо мне", { useInnerText: true });
    await expect(page.getByText("Практикующий QA Automation")).toBeHidden();
  });

  test("Секция 'Обо мне' раскрывается с клавиатуры", async ({ page }) => {
    const summary = aboutSummary(page);

    await summary.focus();
    await page.keyboard.press("Enter");

    await expect(aboutDetails(page)).toHaveAttribute("open", /.*/);
    await expect(page.getByText("Практикующий QA Automation")).toBeVisible();
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

test.describe("Скриншоты страницы", () => {
  buttons.forEach((value) => {
    test(`Отображение изменения, при нажатии кнопки ${value}`, async ({
      page,
    }, testInfo) => {
      skipIfNoBaseline(testInfo, `pageWith${snapshotNames[value]}Button`);

      if (value === "Свернуть") {
        await aboutSummary(page).click();
      }
      await expect(page).toHaveScreenshot(
        `pageWith${snapshotNames[value]}Button.png`,
      );
    });
  });
});
