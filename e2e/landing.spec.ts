import { test, expect } from "@playwright/test";

test.describe("Landing pública", () => {
  test("carga la página principal", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Burgos/);
  });

  test("muestra el hero con el nombre del estudio", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Burgos");
  });

  test("navbar tiene links de navegación", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('a[href="#equipo"]')).toBeVisible();
    await expect(page.locator('a[href="#areas"]')).toBeVisible();
    await expect(page.locator('a[href="#contacto"]')).toBeVisible();
  });

  test("sección de áreas de práctica visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#areas")).toBeVisible();
    await expect(page.locator("text=Áreas de Práctica")).toBeVisible();
  });

  test("formulario de contacto funciona", async ({ page }) => {
    await page.goto("/");
    const form = page.locator("#contacto form");
    await expect(form).toBeVisible();
    await expect(form.locator('input[type="text"]').first()).toBeVisible();
  });

  test("chat widget aparece", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('button[aria-label="Abrir chat"]')).toBeVisible();
  });

  test("página de newsletter carga", async ({ page }) => {
    await page.goto("/newsletter");
    await expect(page.locator("h1")).toContainText("Newsletter");
  });
});

test.describe("SEO", () => {
  test("robots.txt accesible", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
  });

  test("sitemap.xml accesible", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
  });

  test("ERP no indexable en robots.txt", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    const text = await response?.text();
    expect(text).toContain("/erp/");
  });
});
