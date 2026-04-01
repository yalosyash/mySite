import { test, expect } from "@playwright/test";
import { elements } from "../ts/elements/elements";

test.beforeEach(async ({ page }) => {
  await page.goto("https://yalosyash.github.io/mySite/");
});

test.describe("Отображение страницы", () => {
  test("Отображение элементов страницы", async ({ page }) => {
    elements.forEach(({ locator, name }) => {
      test.step(`Отображение элемента ${name}`, async () => {
        await expect.soft(locator(page)).toBeVisible();
      });
    });
  });

  test("Отображение текста элементов страницы", async ({ page }) => {
    elements.forEach(({ locator, name, text }) => {
      if (text) {
        test.step(`Отображение текста ${text} у элемента ${name}`, async () => {
          await expect.soft(locator(page)).toHaveText(text);
        });
      }
    });
  });
});

test.describe("Сравнение ссылок в списке ссылок", () => {
  test("Присутствие атрибутов href в ссылках", async ({ page }) => {
    elements.forEach(({ locator, name, attribute }) => {
      if (attribute) {
        test.step(`Присутствие атрибута ${attribute.type} в ${name}`, async () => {
          await expect
            .soft(locator(page))
            .toHaveAttribute(attribute?.type, attribute?.value);
        });
      }
    });
  });
});

test.describe("Работоспособность кнопок", () => {
  test("Работоспособность кнопки 'Обо мне'", async ({ page }) => {
    await page.getByRole("button", { name: "Обо мне" }).click();

    await expect(page.getByRole("button")).toHaveText("Свернуть");
    await expect(page.getByRole("heading", { name: "Обо мне" })).toBeVisible();
    await expect(
      page.getByText(
        "Практикующий QA Automation Занимаюсь самообразованием в сфере IT",
      ),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Свернуть" })).toBeVisible();

    await page.getByRole("button", { name: "Свернуть" }).click();
    await expect(page.getByRole("button")).toHaveText("Обо мне");
    await expect(page.getByRole("heading", { name: "Обо мне" })).toBeHidden();
  });
});
