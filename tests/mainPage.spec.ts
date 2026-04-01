import { test, expect, Page, Locator } from "@playwright/test";

interface Elements {
  locator: (page: Page) => Locator;
  name: string;
  attribute?: {
    type: string;
    value: string;
  };
}

const elements: Elements[] = [
  {
    locator: (page: Page): Locator => page.getByRole("img", { name: "avatar" }),
    name: "avatar",
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole("heading", { name: "Владислав Клепиков" }),
    name: "Владислав Клепиков heading",
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole("heading", { name: "Связь со мной" }),
    name: "Связь со мной heading",
  },

  {
    locator: (page: Page): Locator =>
      page.getByRole("link", { name: "@yalosyash" }),
    name: "@yalosyash",
    attribute: {
      type: "href",
      value: "https://t.me/yalosyash",
    },
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole("link", { name: "ya.losyash@yandex.ru" }),
    name: "email",
    attribute: {
      type: "href",
      value: "mailto:ya.losyash@yandex.ru",
    },
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole("link", { name: "Vladislav Klepikov" }),
    name: "GitHub",
    attribute: {
      type: "href",
      value: "https://github.com/yalosyash/",
    },
  },
  {
    locator: (page: Page): Locator =>
      page
        .getByRole("listitem")
        .filter({ hasText: "Head Hunter Владислав Клепиков" })
        .getByRole("link"),
    name: "Head Hunter",
    attribute: {
      type: "href",
      value:
        "https://domodedovo.hh.ru/resume/0f8c5712ff0c4649760039ed1f6f506753764c",
    },
  },
  {
    locator: (page: Page): Locator =>
      page
        .getByRole("listitem")
        .filter({ hasText: "Мое Резюме Владислав Клепиков" })
        .getByRole("link"),
    name: "Мое Резюме",
    attribute: {
      type: "href",
      value:
        "https://docs.google.com/document/d/1H7HVMfbcU8mNVZfEO77k6_321jic0WxfpZOHbUzitlA/edit?usp=sharing",
    },
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole("button", { name: "Обо мне" }),
    name: "Обо мне button",
  },
];

const aboutMe = [
  {
    locator: (page: Page): Locator =>
      page.getByRole("heading", { name: "Обо мне" }),
    name: "Обо мне heading",
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole("button", { name: "Свернуть" }),
    name: "Свернуть button",
  },
];

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
    await expect(page.getByRole("button", { name: "Обо мне" })).toHaveText("Обо мне");

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
