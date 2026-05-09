import { expect, test } from "@playwright/test";

test("home flow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /generar nueva mandala/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /descargar pdf/i })).toBeVisible();
  await expect(page.getByRole("img", { name: "Mandala generada" })).toBeVisible();

  await page.getByRole("button", { name: /generar nueva mandala/i }).click();
  await expect(page.getByText(/Seed:/)).toBeVisible();
});
