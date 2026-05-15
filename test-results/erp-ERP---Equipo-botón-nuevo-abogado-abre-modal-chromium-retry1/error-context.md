# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: erp.spec.ts >> ERP - Equipo >> botón nuevo abogado abre modal
- Location: e2e\erp.spec.ts:94:7

# Error details

```
TimeoutError: page.click: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('text=Nuevo Abogado')

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
          - link "Estudios" [ref=e81] [cursor=pointer]:
            - /url: /erp/estudios
            - img [ref=e82]
            - text: Estudios
          - link "Actividad" [ref=e86] [cursor=pointer]:
            - /url: /erp/actividad
            - img [ref=e87]
            - text: Actividad
          - link "Configuración" [ref=e89] [cursor=pointer]:
            - /url: /erp/configuracion
            - img [ref=e90]
            - text: Configuración
          - link "Manual" [ref=e93] [cursor=pointer]:
            - /url: /erp/manual
            - img [ref=e94]
            - text: Manual
        - button "Cerrar sesión" [ref=e98]:
          - img [ref=e99]
          - text: Cerrar sesión
    - generic [ref=e102]:
      - banner [ref=e103]:
        - generic [ref=e105]:
          - img [ref=e106]
          - textbox "Buscar expedientes, clientes..." [ref=e109]
        - generic [ref=e110]:
          - button "Modo claro" [ref=e111]:
            - img [ref=e112]
          - button [ref=e118]:
            - img [ref=e119]
          - generic [ref=e122]:
            - img [ref=e124]
            - generic [ref=e127]:
              - paragraph [ref=e128]: Brandon Nievas
              - paragraph [ref=e129]: director
      - main [ref=e130]:
        - generic [ref=e131]:
          - generic [ref=e132]:
            - generic [ref=e133]:
              - heading "Equipo" [level=1] [ref=e134]:
                - img [ref=e135]
                - text: Equipo
              - paragraph [ref=e140]: Gestión de abogados del estudio
            - button "Nuevo Miembro" [ref=e141]:
              - img [ref=e142]
              - text: Nuevo Miembro
          - generic [ref=e146]:
            - img [ref=e147]
            - textbox "Buscar por nombre o email..." [ref=e150]
          - generic [ref=e151]:
            - generic [ref=e152]:
              - generic [ref=e153]:
                - generic [ref=e155]: a
                - generic [ref=e157]: Activo
              - heading "administrativo" [level=3] [ref=e158]
              - paragraph [ref=e159]: asd
              - paragraph [ref=e160]: empleado@test.com
              - button "Desactivar" [ref=e162]
            - generic [ref=e163]:
              - generic [ref=e164]:
                - generic [ref=e166]: t
                - generic [ref=e168]: Activo
              - heading "test" [level=3] [ref=e169]
              - paragraph [ref=e170]: asdas
              - paragraph [ref=e171]: test@test.com
              - paragraph [ref=e172]: "1231312"
              - button "Desactivar" [ref=e174]
            - generic [ref=e175]:
              - generic [ref=e176]:
                - generic [ref=e178]: BN
                - generic [ref=e179]:
                  - img [ref=e180]
                  - generic [ref=e182]: Activo
              - heading "Brandon Nievas" [level=3] [ref=e183]
              - paragraph [ref=e184]: IT
              - paragraph [ref=e185]: admin@burgos.com.ar
              - paragraph [ref=e186]: CPACF T� XX F� XXX
              - button "Desactivar" [ref=e188]
  - alert [ref=e189]
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
  22  |     await expect(page.getByText("Tareas pendientes", { exact: true })).toBeVisible();
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
  54  |     await expect(page.getByRole("heading", { name: /Pendientes/ })).toBeVisible();
  55  |     await expect(page.getByRole("heading", { name: /En curso/ })).toBeVisible();
  56  |     await expect(page.getByRole("heading", { name: /Completadas/ })).toBeVisible();
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
> 97  |     await page.click("text=Nuevo Abogado");
      |                ^ TimeoutError: page.click: Timeout 10000ms exceeded.
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