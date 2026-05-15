# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: erp.spec.ts >> ERP - Tareas >> página de tareas carga con kanban
- Location: e2e\erp.spec.ts:50:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Pendientes')
Expected: visible
Error: strict mode violation: locator('text=Pendientes') resolved to 2 elements:
    1) <p class="text-burgos-gray-400 text-sm mt-1">…</p> aka getByText('0 pendientes')
    2) <h3 class="text-xs font-semibold text-burgos-gray-400 uppercase tracking-wider">…</h3> aka getByRole('heading', { name: 'Pendientes (0)' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Pendientes')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - complementary [ref=e3]:
      - generic [ref=e4]:
        - link "Burgos BurgosERP" [ref=e6] [cursor=pointer]:
          - /url: /erp
          - img "Burgos" [ref=e7]
          - generic [ref=e8]: BurgosERP
        - navigation [ref=e9]:
          - link "Dashboard" [ref=e10] [cursor=pointer]:
            - /url: /erp
            - img [ref=e11]
            - text: Dashboard
          - link "Métricas" [ref=e16] [cursor=pointer]:
            - /url: /erp/dashboard-director
            - img [ref=e17]
            - text: Métricas
          - link "Expedientes" [ref=e19] [cursor=pointer]:
            - /url: /erp/expedientes
            - img [ref=e20]
            - text: Expedientes
          - link "Turnos" [ref=e22] [cursor=pointer]:
            - /url: /erp/turnos
            - img [ref=e23]
            - text: Turnos
          - link "Tareas" [ref=e25] [cursor=pointer]:
            - /url: /erp/tareas
            - img [ref=e26]
            - text: Tareas
          - link "Audiencias" [ref=e29] [cursor=pointer]:
            - /url: /erp/audiencias
            - img [ref=e30]
            - text: Audiencias
          - link "Honorarios" [ref=e36] [cursor=pointer]:
            - /url: /erp/honorarios
            - img [ref=e37]
            - text: Honorarios
          - link "Mensajes" [ref=e39] [cursor=pointer]:
            - /url: /erp/mensajes
            - img [ref=e40]
            - text: Mensajes
          - link "Asistente IA" [ref=e42] [cursor=pointer]:
            - /url: /erp/ia
            - img [ref=e43]
            - text: Asistente IA
          - link "Escritos" [ref=e46] [cursor=pointer]:
            - /url: /erp/escritos
            - img [ref=e47]
            - text: Escritos
          - link "Jurisprudencia" [ref=e51] [cursor=pointer]:
            - /url: /erp/jurisprudencia
            - img [ref=e52]
            - text: Jurisprudencia
          - link "Newsletter" [ref=e54] [cursor=pointer]:
            - /url: /erp/newsletter
            - img [ref=e55]
            - text: Newsletter
          - link "Clientes" [ref=e58] [cursor=pointer]:
            - /url: /erp/clientes
            - img [ref=e59]
            - text: Clientes
          - link "Equipo" [ref=e64] [cursor=pointer]:
            - /url: /erp/abogados
            - img [ref=e65]
            - text: Equipo
          - link "Mi Perfil" [ref=e68] [cursor=pointer]:
            - /url: /erp/perfil
            - img [ref=e69]
            - text: Mi Perfil
          - link "Configuración" [ref=e81] [cursor=pointer]:
            - /url: /erp/configuracion
            - img [ref=e82]
            - text: Configuración
          - link "Manual" [ref=e85] [cursor=pointer]:
            - /url: /erp/manual
            - img [ref=e86]
            - text: Manual
        - button "Cerrar sesión" [ref=e90]:
          - img [ref=e91]
          - text: Cerrar sesión
    - generic [ref=e94]:
      - banner [ref=e95]:
        - generic [ref=e97]:
          - img [ref=e98]
          - textbox "Buscar expedientes, clientes..." [ref=e101]
        - generic [ref=e102]:
          - button "Modo claro" [ref=e103]:
            - img [ref=e104]
          - button [ref=e110]:
            - img [ref=e111]
          - generic [ref=e114]:
            - img [ref=e116]
            - generic [ref=e119]:
              - paragraph [ref=e120]: ...
              - paragraph
      - main [ref=e121]:
        - generic [ref=e122]:
          - generic [ref=e123]:
            - generic [ref=e124]:
              - heading "Tareas" [level=1] [ref=e125]:
                - img [ref=e126]
                - text: Tareas
              - paragraph [ref=e129]: 0 pendientes
            - button "Nueva Tarea" [ref=e130]:
              - img [ref=e131]
              - text: Nueva Tarea
          - generic [ref=e132]:
            - button "Todas" [ref=e133]
            - button "Pendiente" [ref=e134]
            - button "En curso" [ref=e135]
            - button "Completada" [ref=e136]
          - generic [ref=e137]:
            - heading "Pendientes (0)" [level=3] [ref=e141]
            - heading "En curso (0)" [level=3] [ref=e145]
            - heading "Completadas (0)" [level=3] [ref=e149]
  - alert [ref=e152]
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
  22  |     await expect(page.locator("text=Tareas pendientes")).toBeVisible();
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
> 54  |     await expect(page.locator("text=Pendientes")).toBeVisible();
      |                                                   ^ Error: expect(locator).toBeVisible() failed
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