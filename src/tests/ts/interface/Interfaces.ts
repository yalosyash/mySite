import { Page, Locator } from "@playwright/test";

export interface Elements {
  locator: (page: Page) => Locator;
  text?: string;
  name: string;
  attribute?: {
    type: string;
    value: string;
  };
}
