# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: erp.spec.ts >> ERP - Dashboard >> muestra stats cards
- Location: e2e\erp.spec.ts:18:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Tareas pendientes')
Expected: visible
Error: strict mode violation: locator('text=Tareas pendientes') resolved to 2 elements:
    1) <p class="text-xs text-burgos-gray-400 mt-0.5">Tareas pendientes</p> aka getByText('Tareas pendientes', { exact: true })
    2) <p class="text-burgos-gray-600 text-sm py-4 text-center">Sin tareas pendientes</p> aka getByText('Sin tareas pendientes')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Tareas pendientes')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]: ERP | Burgos & Asociados
  - generic [ref=e3]:
    - complementary [ref=e4]:
      - generic [ref=e5]:
        - link "Burgos BurgosERP" [ref=e7] [cursor=pointer]:
          - /url: /erp
          - img "Burgos" [ref=e8]
          - generic [ref=e9]: BurgosERP
        - navigation [ref=e10]:
          - link "Dashboard" [ref=e11] [cursor=pointer]:
            - /url: /erp
            - img [ref=e12]
            - text: Dashboard
          - link "Métricas" [ref=e17] [cursor=pointer]:
            - /url: /erp/dashboard-director
            - img [ref=e18]
            - text: Métricas
          - link "Expedientes" [ref=e20] [cursor=pointer]:
            - /url: /erp/expedientes
            - img [ref=e21]
            - text: Expedientes
          - link "Turnos" [ref=e23] [cursor=pointer]:
            - /url: /erp/turnos
            - img [ref=e24]
            - text: Turnos
          - link "Tareas" [ref=e26] [cursor=pointer]:
            - /url: /erp/tareas
            - img [ref=e27]
            - text: Tareas
          - link "Audiencias" [ref=e30] [cursor=pointer]:
            - /url: /erp/audiencias
            - img [ref=e31]
            - text: Audiencias
          - link "Honorarios" [ref=e37] [cursor=pointer]:
            - /url: /erp/honorarios
            - img [ref=e38]
            - text: Honorarios
          - link "Mensajes" [ref=e40] [cursor=pointer]:
            - /url: /erp/mensajes
            - img [ref=e41]
            - text: Mensajes
          - link "Asistente IA" [ref=e43] [cursor=pointer]:
            - /url: /erp/ia
            - img [ref=e44]
            - text: Asistente IA
          - link "Escritos" [ref=e47] [cursor=pointer]:
            - /url: /erp/escritos
            - img [ref=e48]
            - text: Escritos
          - link "Jurisprudencia" [ref=e52] [cursor=pointer]:
            - /url: /erp/jurisprudencia
            - img [ref=e53]
            - text: Jurisprudencia
          - link "Newsletter" [ref=e55] [cursor=pointer]:
            - /url: /erp/newsletter
            - img [ref=e56]
            - text: Newsletter
          - link "Clientes" [ref=e59] [cursor=pointer]:
            - /url: /erp/clientes
            - img [ref=e60]
            - text: Clientes
          - link "Equipo" [ref=e65] [cursor=pointer]:
            - /url: /erp/abogados
            - img [ref=e66]
            - text: Equipo
          - link "Mi Perfil" [ref=e69] [cursor=pointer]:
            - /url: /erp/perfil
            - img [ref=e70]
            - text: Mi Perfil
          - link "Configuración" [ref=e82] [cursor=pointer]:
            - /url: /erp/configuracion
            - img [ref=e83]
            - text: Configuración
          - link "Manual" [ref=e86] [cursor=pointer]:
            - /url: /erp/manual
            - img [ref=e87]
            - text: Manual
        - button "Cerrar sesión" [ref=e91]:
          - img [ref=e92]
          - text: Cerrar sesión
    - generic [ref=e95]:
      - banner [ref=e96]:
        - generic [ref=e98]:
          - img [ref=e99]
          - textbox "Buscar expedientes, clientes..." [ref=e102]
        - generic [ref=e103]:
          - button "Modo claro" [ref=e104]:
            - img [ref=e105]
          - button [ref=e111]:
            - img [ref=e112]
          - generic [ref=e115]:
            - img [ref=e117]
            - generic [ref=e120]:
              - paragraph [ref=e121]: ...
              - paragraph
      - main [ref=e122]:
        - generic [ref=e123]:
          - generic [ref=e124]:
            - heading "Dashboard" [level=1] [ref=e125]
            - paragraph [ref=e126]: Resumen general del estudio
          - generic [ref=e127]:
            - generic [ref=e128]:
              - img [ref=e130]
              - paragraph [ref=e132]: "2"
              - paragraph [ref=e133]: Expedientes activos
            - generic [ref=e134]:
              - img [ref=e136]
              - paragraph [ref=e138]: "0"
              - paragraph [ref=e139]: Turnos hoy
            - generic [ref=e140]:
              - img [ref=e142]
              - paragraph [ref=e145]: "0"
              - paragraph [ref=e146]: Tareas pendientes
            - generic [ref=e147]:
              - img [ref=e149]
              - paragraph [ref=e154]: "0"
              - paragraph [ref=e155]: Clientes activos
          - generic [ref=e156]:
            - generic [ref=e157]:
              - heading "Próximas Audiencias" [level=2] [ref=e158]:
                - img [ref=e159]
                - text: Próximas Audiencias
              - paragraph [ref=e165]: Sin audiencias próximas
            - generic [ref=e166]:
              - heading "Tareas Próximas" [level=2] [ref=e167]:
                - img [ref=e168]
                - text: Tareas Próximas
              - paragraph [ref=e170]: Sin tareas pendientes
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | // Helper: login antes de cada test del ERP
  4   | async function loginAsAdmin(page: any) {
  5   |   await page.goto("/login");
  6   |   await page.fill('input[type="email"]', "admin@burgos.com.ar");
  7   |   await page.fill('input[type="password"]', "Burgos_Admin_2025");
  8   |   await page.click('button[type="submit"]');
  9   |   await page.waitForURL(/\/erp/, { timeout: 10000 });
  10  | }
  11  | 
  12  | test.describe("ERP - Dashboard", () => {
  13  |   test("muestra el dashboard después de login", async ({ page }) => {
  14  |     await loginAsAdmin(page);
  15  |     await expect(page.locator("h1")).toContainText("Dashboard");
  16  |   });
  17  | 
  18  |   test("muestra stats cards", async ({ page }) => {
  19  |     await loginAsAdmin(page);
  20  |     await expect(page.locator("text=Expedientes activos")).toBeVisible();
  21  |     await expect(page.locator("text=Turnos hoy")).toBeVisible();
> 22  |     await expect(page.locator("text=Tareas pendientes")).toBeVisible();
      |                                                          ^ Error: expect(locator).toBeVisible() failed
  23  |   });
  24  | });
  25  | 
  26  | test.describe("ERP - Expedientes", () => {
  27  |   test("página de expedientes carga", async ({ page }) => {
  28  |     await loginAsAdmin(page);
  29  |     await page.click('a[href="/erp/expedientes"]');
  30  |     await expect(page.locator("h1")).toContainText("Expedientes");
  31  |   });
  32  | 
  33  |   test("botón nuevo expediente abre modal", async ({ page }) => {
  34  |     await loginAsAdmin(page);
  35  |     await page.goto("/erp/expedientes");
  36  |     await page.click("text=Nuevo Expediente");
  37  |     await expect(page.locator("text=Carátula")).toBeVisible();
  38  |   });
  39  | });
  40  | 
  41  | test.describe("ERP - Turnos", () => {
  42  |   test("página de turnos carga", async ({ page }) => {
  43  |     await loginAsAdmin(page);
  44  |     await page.goto("/erp/turnos");
  45  |     await expect(page.locator("h1")).toContainText("Turnos");
  46  |   });
  47  | });
  48  | 
  49  | test.describe("ERP - Tareas", () => {
  50  |   test("página de tareas carga con kanban", async ({ page }) => {
  51  |     await loginAsAdmin(page);
  52  |     await page.goto("/erp/tareas");
  53  |     await expect(page.locator("h1")).toContainText("Tareas");
  54  |     await expect(page.locator("text=Pendientes")).toBeVisible();
  55  |     await expect(page.locator("text=En curso")).toBeVisible();
  56  |     await expect(page.locator("text=Completadas")).toBeVisible();
  57  |   });
  58  | });
  59  | 
  60  | test.describe("ERP - Audiencias", () => {
  61  |   test("página de audiencias carga", async ({ page }) => {
  62  |     await loginAsAdmin(page);
  63  |     await page.goto("/erp/audiencias");
  64  |     await expect(page.locator("h1")).toContainText("Audiencias");
  65  |   });
  66  | });
  67  | 
  68  | test.describe("ERP - Honorarios", () => {
  69  |   test("página de honorarios carga", async ({ page }) => {
  70  |     await loginAsAdmin(page);
  71  |     await page.goto("/erp/honorarios");
  72  |     await expect(page.locator("h1")).toContainText("Honorarios");
  73  |     await expect(page.locator("text=Cobrado")).toBeVisible();
  74  |   });
  75  | });
  76  | 
  77  | test.describe("ERP - IA", () => {
  78  |   test("página de IA carga con saludo", async ({ page }) => {
  79  |     await loginAsAdmin(page);
  80  |     await page.goto("/erp/ia");
  81  |     await expect(page.locator("h1")).toContainText("Asistente IA");
  82  |     // Debe saludar al usuario
  83  |     await expect(page.locator("text=Hola")).toBeVisible({ timeout: 5000 });
  84  |   });
  85  | });
  86  | 
  87  | test.describe("ERP - Equipo", () => {
  88  |   test("página de equipo carga", async ({ page }) => {
  89  |     await loginAsAdmin(page);
  90  |     await page.goto("/erp/abogados");
  91  |     await expect(page.locator("h1")).toContainText("Equipo");
  92  |   });
  93  | 
  94  |   test("botón nuevo abogado abre modal", async ({ page }) => {
  95  |     await loginAsAdmin(page);
  96  |     await page.goto("/erp/abogados");
  97  |     await page.click("text=Nuevo Abogado");
  98  |     await expect(page.locator("text=Nombre completo")).toBeVisible();
  99  |   });
  100 | });
  101 | 
  102 | test.describe("ERP - Perfil", () => {
  103 |   test("página de perfil carga con datos del usuario", async ({ page }) => {
  104 |     await loginAsAdmin(page);
  105 |     await page.goto("/erp/perfil");
  106 |     await expect(page.locator("h1")).toContainText("Mi Perfil");
  107 |   });
  108 | });
  109 | 
```