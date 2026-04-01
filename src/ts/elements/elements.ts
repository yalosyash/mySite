import { Locator, Page } from "@playwright/test";
import { Elements } from "../interface/interface";

export const elements: Elements[] = [
  {
    locator: (page: Page): Locator => page.getByRole("img", { name: "avatar" }),
    name: "avatar img",
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole("heading", { name: "QA Engineer" }),
    text: "QA Engineer",
    name: "QA Engineer heading",
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole("heading", { name: "Владислав Клепиков" }),
    text: "Владислав Клепиков",
    name: "Владислав Клепиков heading",
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole("heading", { name: "Связь со мной" }),
    text: "Связь со мной",
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
    text: "Обо мне",
    name: "Обо мне button",
  },
];
