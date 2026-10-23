import { Locator, Page } from "@playwright/test";
import { Elements } from "../interface/interfaces";

/**
 * Раскрывающийся блок «Обо мне».
 * Реализован нативным <details>/<summary>, поэтому в тестах работаем с <summary>,
 * а состояние читаем с самого <details> (атрибут open).
 */
export const aboutSummary = (page: Page): Locator => page.locator("summary");
export const aboutDetails = (page: Page): Locator =>
  page.locator("details.about");

export const elements: Elements[] = [
  {
    locator: (page: Page): Locator =>
      page.getByRole("img", { name: "Владислав Клепиков" }),
    name: "avatar img",
  },
  {
    locator: (page: Page): Locator =>
      page.getByText("QA Engineer", { exact: true }),
    text: "QA Engineer",
    name: "QA Engineer badge",
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole("heading", { name: "Владислав Клепиков", level: 1 }),
    text: "Владислав Клепиков",
    name: "Владислав Клепиков heading",
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole("heading", { name: "Связь со мной", level: 2 }),
    text: "Связь со мной",
    name: "Связь со мной heading",
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole("link", { name: "Телеграм @yalosyash" }),
    name: "Telegram",
    attribute: {
      type: "href",
      value: "https://t.me/yalosyash",
    },
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole("link", { name: "Эл. почта ya.losyash@yandex.ru" }),
    name: "email",
    attribute: {
      type: "href",
      value: "mailto:ya.losyash@yandex.ru",
    },
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole("link", { name: "GitHub Vladislav Klepikov" }),
    name: "GitHub",
    attribute: {
      type: "href",
      value: "https://github.com/yalosyash/",
    },
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole("link", { name: "Head Hunter Владислав Клепиков" }),
    name: "Head Hunter",
    attribute: {
      type: "href",
      value:
        "https://domodedovo.hh.ru/resume/0f8c5712ff0c4649760039ed1f6f506753764c",
    },
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole("link", { name: "Мое резюме Google Docs" }),
    name: "Мое резюме",
    attribute: {
      type: "href",
      value:
        "https://docs.google.com/document/d/1H7HVMfbcU8mNVZfEO77k6_321jic0WxfpZOHbUzitlA/edit?usp=sharing",
    },
  },
  {
    locator: (page: Page): Locator => aboutSummary(page),
    text: "Обо мне",
    innerText: true,
    name: "Обо мне summary",
  },
];
