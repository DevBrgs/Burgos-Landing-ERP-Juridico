import { test, expect } from "@playwright/test";

test.describe("Autenticación ERP", () => {
  test("redirige a login si no hay sesión", async ({ page }) => {
    await page.goto("/erp");
    await expect(page).toHaveURL(/\/login/);
  });

  test("página de login carga correctamente", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText("Acceso al ERP");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("muestra error con credenciales incorrectas", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "fake@test.com");
    await page.fill('input[type="password"]', "wrongpass");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Credenciales incorrectas")).toBeVisible({ timeout: 5000 });
  });

  test("login exitoso redirige al ERP", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "admin@burgos.com.ar");
    await page.fill('input[type="password"]', "Burgos_Admin_2025");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/erp/, { timeout: 10000 });
  });
});

test.describe("Portal de clientes", () => {
  test("página del portal carga", async ({ page }) => {
    await page.goto("/portal");
    await expect(page.locator("h1")).toContainText("Portal de Clientes");
  });

  test("muestra error con DNI incorrecto", async ({ page }) => {
    await page.goto("/portal");
    await page.fill('input[placeholder="12345678"]', "99999999");
    await page.fill('input[placeholder="••••••••"]', "wrongclave");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=DNI no encontrado")).toBeVisible({ timeout: 5000 });
  });
});
