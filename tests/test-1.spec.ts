import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://yalosyash.github.io/mySite/");
});

test.describe("Отображение страницы", () => {
  test("Отображение элементов страницы", async ({ page }) => {
    await expect.soft(page.getByRole("img", { name: "avatar" })).toBeVisible();
    await expect
      .soft(page.getByRole("heading", { name: "Владислав Клепиков" }))
      .toBeVisible();
    await expect
      .soft(page.getByRole("heading", { name: "Связь со мной" }))
      .toBeVisible();
    await expect.soft(page.getByRole("list")).toBeVisible();
    await expect
      .soft(page.getByRole("button", { name: "Обо мне" }))
      .toBeVisible();
  });
});

test.describe("Сравнение ссылок в списке ссылок", () => {
  test("Присутствие атрибутов href в ссылках", async ({ page }) => {
    await expect
      .soft(page.getByRole("link", { name: "@yalosyash" }))
      .toHaveAttribute("href", "https://t.me/yalosyash");
    await expect
      .soft(page.getByRole("link", { name: "ya.losyash@yandex.ru" }))
      .toHaveAttribute("href", "mailto:ya.losyash@yandex.ru");
    await expect
      .soft(page.getByRole("link", { name: "Vladislav Klepikov" }))
      .toHaveAttribute("href", "https://github.com/yalosyash/");
    await expect
      .soft(
        page
          .getByRole("listitem")
          .filter({ hasText: "Head Hunter Владислав Клепиков" })
          .getByRole("link"),
      )
      .toHaveAttribute(
        "href",
        "https://domodedovo.hh.ru/resume/0f8c5712ff0c4649760039ed1f6f506753764c",
      );
    await expect
      .soft(
        page
          .getByRole("listitem")
          .filter({ hasText: "Мое Резюме Владислав Клепиков" })
          .getByRole("link"),
      )
      .toHaveAttribute(
        "href",
        "https://docs.google.com/document/d/1H7HVMfbcU8mNVZfEO77k6_321jic0WxfpZOHbUzitlA/edit?usp=sharing",
      );
  });
});

test.describe("Работоспособность кнопок", () => {
  test("Работоспособность кнопки 'Обо мне'", async ({ page }) => {
    await expect(page.getByRole("button")).toHaveText("Обо мне");

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
