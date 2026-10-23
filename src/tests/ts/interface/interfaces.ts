import { Page, Locator } from "@playwright/test";

export interface Elements {
  locator: (page: Page) => Locator;
  text?: string;
  /**
   * Сравнивать текст по innerText, а не по textContent.
   * Нужно для <summary>, где в разметке лежат оба варианта подписи
   * («Обо мне» и «Свернуть»), а виден только один.
   */
  innerText?: boolean;
  name: string;
  attribute?: {
    type: string;
    value: string;
  };
}
