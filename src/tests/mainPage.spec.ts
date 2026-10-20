import { test, expect, Page } from "@playwright/test";
import { elements } from "./ts/elements/elements";
import { buttons } from "./ts/elements/buttons";

const snapshotNames: Record<string, string> = {
  "Обо мне": "AboutMe",
  Свернуть: "Collapse",
};

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
    for (const { locator, name, text } of elements) {
      if (text) {
        await test.step(name, async () => {
          await expect(locator(page), name).toHaveText(text);
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
});

test.describe("Работоспособность кнопок", () => {
  test("Работоспособность кнопки 'Обо мне'", async ({ page }) => {
    const aboutButton = page.getByRole("button", { name: "Обо мне" });
    const collapseButton = page.getByRole("button", { name: "Свернуть" });

    await aboutButton.click();

    await expect(collapseButton).toBeVisible();
    await expect(page.getByRole("heading", { name: "Обо мне" })).toBeVisible();
    await expect(
      page.getByText(
        "Практикующий QA Automation Занимаюсь самообразованием в сфере IT",
      ),
    ).toBeVisible();

    await collapseButton.click();

    await expect(aboutButton).toBeVisible();
    await expect(page.getByRole("heading", { name: "Обо мне" })).toBeHidden();
  });

  buttons.forEach((value) => {
    test(`Отображение изменения, при нажатии кнопки ${value}`, async ({
      page,
    }) => {
      if (value === "Свернуть") {
        await page.getByRole("button", { name: "Обо мне" }).click();
      }
      await expect(page).toHaveScreenshot(
        `pageWith${snapshotNames[value]}Button.png`,
      );
    });
  });
});
