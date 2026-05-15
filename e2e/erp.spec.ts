import { test, expect } from "@playwright/test";

// Helper: login antes de cada test del ERP
async function loginAsAdmin(page: any) {
  await page.goto("/login");
  await page.fill('input[type="email"]', "admin@burgos.com.ar");
  await page.fill('input[type="password"]', "Burgos_Admin_2025");
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/erp/, { timeout: 10000 });
}

test.describe("ERP - Dashboard", () => {
  test("muestra el dashboard después de login", async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page.locator("h1")).toContainText("Dashboard");
  });

  test("muestra stats cards", async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page.locator("text=Expedientes activos")).toBeVisible();
    await expect(page.locator("text=Turnos hoy")).toBeVisible();
    await expect(page.getByText("Tareas pendientes", { exact: true })).toBeVisible();
  });
});

test.describe("ERP - Expedientes", () => {
  test("página de expedientes carga", async ({ page }) => {
    await loginAsAdmin(page);
    await page.click('a[href="/erp/expedientes"]');
    await expect(page.locator("h1")).toContainText("Expedientes");
  });

  test("botón nuevo expediente abre modal", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/erp/expedientes");
    await page.click("text=Nuevo Expediente");
    await expect(page.locator("text=Carátula")).toBeVisible();
  });
});

test.describe("ERP - Turnos", () => {
  test("página de turnos carga", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/erp/turnos");
    await expect(page.locator("h1")).toContainText("Turnos");
  });
});

test.describe("ERP - Tareas", () => {
  test("página de tareas carga con kanban", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/erp/tareas");
    await expect(page.locator("h1")).toContainText("Tareas");
    await expect(page.getByRole("heading", { name: /Pendientes/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /En curso/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Completadas/ })).toBeVisible();
  });
});

test.describe("ERP - Audiencias", () => {
  test("página de audiencias carga", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/erp/audiencias");
    await expect(page.locator("h1")).toContainText("Audiencias");
  });
});

test.describe("ERP - Honorarios", () => {
  test("página de honorarios carga", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/erp/honorarios");
    await expect(page.locator("h1")).toContainText("Honorarios");
    await expect(page.locator("text=Cobrado")).toBeVisible();
  });
});

test.describe("ERP - IA", () => {
  test("página de IA carga con saludo", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/erp/ia");
    await expect(page.locator("h1")).toContainText("Asistente IA");
    // Debe saludar al usuario
    await expect(page.locator("text=Hola")).toBeVisible({ timeout: 5000 });
  });
});

test.describe("ERP - Equipo", () => {
  test("página de equipo carga", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/erp/abogados");
    await expect(page.locator("h1")).toContainText("Equipo");
  });

  test("botón nuevo abogado abre modal", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/erp/abogados");
    await page.click("text=Nuevo Miembro");
    await expect(page.locator("text=Nombre completo")).toBeVisible();
  });
});

test.describe("ERP - Perfil", () => {
  test("página de perfil carga con datos del usuario", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/erp/perfil");
    await expect(page.locator("h1")).toContainText("Mi Perfil");
  });
});
