import { test, expect } from "@playwright/test";
import { elements } from "./ts/elements/Elements";
import { buttons } from "./ts/elements/Buttons";

const baseURL = "https://yalosyash.github.io/mySite/";

async function openPage(page: any) {
  await page.route("https://mc.yandex.ru/**", (route: any) => route.abort());
  await page.goto(baseURL, { waitUntil: "domcontentloaded" });
}

test.describe("Отображение страницы", () => {
  test("Отображение элементов страницы", async ({ page }) => {
    await openPage(page);
    for (const { locator, name } of elements) {
      await expect(locator(page)).toBeVisible();
    }
  });

  test("Отображение текста элементов страницы", async ({ page }) => {
    await openPage(page);
    for (const { locator, name, text } of elements) {
      if (text) {
        await expect(locator(page)).toHaveText(text);
      }
    }
  });
});

test.describe("Сравнение ссылок в списке ссылок", () => {
  test("Присутствие атрибутов href в ссылках", async ({ page }) => {
    await openPage(page);
    for (const { locator, name, attribute } of elements) {
      if (attribute) {
        await expect(locator(page)).toHaveAttribute(
          attribute?.type,
          attribute?.value,
        );
      }
    }
  });
});

test.describe("Работоспособность кнопок", () => {
  test("Работоспособность кнопки 'Обо мне'", async ({ page }) => {
    await openPage(page);

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

  buttons.forEach((value) => {
    test(`Отображение изменения, при нажатии кнопки ${value}`, async ({
      page,
    }) => {
      await openPage(page);
      if (value === "Свернуть") {
        await page.getByRole("button").click();
      }
      await expect(page).toHaveScreenshot(`pageWith${value}Button.png`);
    });
  });
});
