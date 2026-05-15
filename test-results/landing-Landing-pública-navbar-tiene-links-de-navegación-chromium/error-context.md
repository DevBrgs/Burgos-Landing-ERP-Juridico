# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: landing.spec.ts >> Landing pública >> navbar tiene links de navegación
- Location: e2e\landing.spec.ts:14:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('a[href="#equipo"]')
Expected: visible
Error: strict mode violation: locator('a[href="#equipo"]') resolved to 2 elements:
    1) <a href="#equipo" class="inline-flex items-center justify-center gap-2 border border-burgos-gray-600 hover:border-burgos-gold/50 text-burgos-gray-200 hover:text-burgos-gold px-8 py-4 rounded-full font-medium transition-all duration-300">Conocé al Equipo</a> aka getByRole('link', { name: 'Conocé al Equipo' })
    2) <a href="#equipo" class="text-burgos-gray-400 hover:text-burgos-gold text-xs transition-colors">Equipo</a> aka getByRole('contentinfo').getByRole('link', { name: 'Equipo' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('a[href="#equipo"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e4]:
        - link "Burgos & Asociados Burgos & Asociados" [ref=e5] [cursor=pointer]:
          - /url: /
          - img "Burgos & Asociados" [ref=e6]
          - generic [ref=e7]:
            - generic [ref=e8]: Burgos
            - generic [ref=e9]: "& Asociados"
        - generic [ref=e10]:
          - link "Inicio" [ref=e11] [cursor=pointer]:
            - /url: /#inicio
            - text: Inicio
          - link "Novedades" [ref=e12] [cursor=pointer]:
            - /url: /#newsletter
            - text: Novedades
          - link "Equipo" [ref=e13] [cursor=pointer]:
            - /url: /#equipo
            - text: Equipo
          - link "Áreas" [ref=e14] [cursor=pointer]:
            - /url: /#areas
            - text: Áreas
          - link "Honorarios" [ref=e15] [cursor=pointer]:
            - /url: /#servicios
            - text: Honorarios
          - link "Contacto" [ref=e16] [cursor=pointer]:
            - /url: /#contacto
            - text: Contacto
          - link "Portal Clientes" [ref=e17] [cursor=pointer]:
            - /url: /portal
  - main [ref=e18]:
    - generic [ref=e19]:
      - generic [ref=e50]:
        - img "Burgos & Asociados" [ref=e53]
        - heading "Burgos & Asociados" [level=1] [ref=e56]
        - paragraph [ref=e57]: Estudio Jurídico
        - paragraph [ref=e58]: Soluciones legales integrales con compromiso, experiencia y resultados. Innovación al servicio de la justicia.
        - generic [ref=e59]:
          - link "Consulta Inicial" [ref=e60] [cursor=pointer]:
            - /url: "#contacto"
            - text: Consulta Inicial
            - img [ref=e61]
          - link "Conocé al Equipo" [ref=e63] [cursor=pointer]:
            - /url: "#equipo"
      - generic [ref=e67]: Scroll
    - generic [ref=e72]:
      - generic [ref=e73]:
        - generic [ref=e74]:
          - text: Newsletter Jurídico
          - heading "Novedades" [level=2] [ref=e75]
          - paragraph [ref=e76]: Publicado por nuestros profesionales. Noticias, jurisprudencia, eventos y casos de éxito.
        - link "Ver todas las publicaciones" [ref=e77] [cursor=pointer]:
          - /url: /newsletter
          - text: Ver todas las publicaciones
          - img [ref=e78]
      - generic [ref=e80]:
        - article [ref=e81]:
          - link "Nuevas modificaciones al Código Procesal Civil y Comercial Novedades Normativas 10 May 2025 Nuevas modificaciones al Código Procesal Civil y Comercial Análisis de las recientes reformas que impactan en los plazos procesales y la tramitación de causas civiles en el ámbito nacional. Dr. Martín Burgos Leer más" [ref=e82] [cursor=pointer]:
            - /url: /newsletter/1
            - generic [ref=e83]:
              - img "Nuevas modificaciones al Código Procesal Civil y Comercial" [ref=e85]
              - generic [ref=e87]:
                - generic [ref=e88]:
                  - generic [ref=e89]: Novedades Normativas
                  - generic [ref=e90]:
                    - img [ref=e91]
                    - text: 10 May 2025
                - heading "Nuevas modificaciones al Código Procesal Civil y Comercial" [level=3] [ref=e94]
                - paragraph [ref=e95]: Análisis de las recientes reformas que impactan en los plazos procesales y la tramitación de causas civiles en el ámbito nacional.
                - generic [ref=e96]:
                  - generic [ref=e97]:
                    - img [ref=e98]
                    - text: Dr. Martín Burgos
                  - generic [ref=e101]:
                    - text: Leer más
                    - img [ref=e102]
        - generic [ref=e105]:
          - article [ref=e106]:
            - 'link "Caso de éxito: Indemnización por despido discriminatorio Casos de Éxito Caso de éxito: Indemnización por despido discriminatorio Dra. Laura Méndez 5 May 2025" [ref=e107] [cursor=pointer]':
              - /url: /newsletter/2
              - generic [ref=e108]:
                - 'img "Caso de éxito: Indemnización por despido discriminatorio" [ref=e110]'
                - generic [ref=e111]:
                  - generic [ref=e113]: Casos de Éxito
                  - 'heading "Caso de éxito: Indemnización por despido discriminatorio" [level=4] [ref=e114]'
                  - generic [ref=e115]:
                    - generic [ref=e116]:
                      - img [ref=e117]
                      - text: Dra. Laura Méndez
                    - generic [ref=e120]:
                      - img [ref=e121]
                      - text: 5 May 2025
          - article [ref=e124]:
            - 'link "Charla abierta: Derechos del consumidor en la era digital Eventos Charla abierta: Derechos del consumidor en la era digital Dra. Carolina Vega 1 May 2025" [ref=e125] [cursor=pointer]':
              - /url: /newsletter/3
              - generic [ref=e126]:
                - 'img "Charla abierta: Derechos del consumidor en la era digital" [ref=e128]'
                - generic [ref=e129]:
                  - generic [ref=e131]: Eventos
                  - 'heading "Charla abierta: Derechos del consumidor en la era digital" [level=4] [ref=e132]'
                  - generic [ref=e133]:
                    - generic [ref=e134]:
                      - img [ref=e135]
                      - text: Dra. Carolina Vega
                    - generic [ref=e138]:
                      - img [ref=e139]
                      - text: 1 May 2025
          - article [ref=e142]:
            - 'link "Actualización: Nuevos montos de UMA para regulación de honorarios Novedades Normativas Actualización: Nuevos montos de UMA para regulación de honorarios Dr. Alejandro Torres 28 Abr 2025" [ref=e143] [cursor=pointer]':
              - /url: /newsletter/4
              - generic [ref=e144]:
                - 'img "Actualización: Nuevos montos de UMA para regulación de honorarios" [ref=e146]'
                - generic [ref=e147]:
                  - generic [ref=e149]: Novedades Normativas
                  - 'heading "Actualización: Nuevos montos de UMA para regulación de honorarios" [level=4] [ref=e150]'
                  - generic [ref=e151]:
                    - generic [ref=e152]:
                      - img [ref=e153]
                      - text: Dr. Alejandro Torres
                    - generic [ref=e156]:
                      - img [ref=e157]
                      - text: 28 Abr 2025
          - article [ref=e160]:
            - 'link "Jurisprudencia: CSJN sobre prescripción en acciones laborales Jurisprudencia Jurisprudencia: CSJN sobre prescripción en acciones laborales Dra. Laura Méndez 22 Abr 2025" [ref=e161] [cursor=pointer]':
              - /url: /newsletter/5
              - generic [ref=e162]:
                - 'img "Jurisprudencia: CSJN sobre prescripción en acciones laborales" [ref=e164]'
                - generic [ref=e165]:
                  - generic [ref=e167]: Jurisprudencia
                  - 'heading "Jurisprudencia: CSJN sobre prescripción en acciones laborales" [level=4] [ref=e168]'
                  - generic [ref=e169]:
                    - generic [ref=e170]:
                      - img [ref=e171]
                      - text: Dra. Laura Méndez
                    - generic [ref=e174]:
                      - img [ref=e175]
                      - text: 22 Abr 2025
      - generic [ref=e179]:
        - generic [ref=e180]:
          - heading "Suscribite al resumen semanal" [level=3] [ref=e181]
          - paragraph [ref=e182]: Recibí las novedades legales más relevantes cada semana en tu casilla.
        - generic [ref=e183]:
          - textbox "tu@email.com" [ref=e184]
          - button "Suscribirme" [ref=e185]
    - generic [ref=e189]:
      - generic [ref=e190]:
        - text: Profesionales
        - heading "Nuestro Equipo" [level=2] [ref=e191]
      - generic [ref=e193]:
        - button "Anterior" [ref=e194]:
          - img [ref=e195]
        - button "Siguiente" [ref=e197]:
          - img [ref=e198]
        - generic [ref=e202]:
          - generic [ref=e205]: t
          - generic [ref=e206]:
            - heading "test" [level=3] [ref=e207]
            - paragraph [ref=e208]: asdas
            - paragraph [ref=e209]: "1231312"
            - generic [ref=e210]:
              - button "Reservar turno" [ref=e211]:
                - img [ref=e212]
                - text: Reservar turno
              - link "Ver perfil" [ref=e214] [cursor=pointer]:
                - /url: /equipo/4b8563e8-768b-48fa-b35f-f9750aa37ac5
                - text: Ver perfil
                - img [ref=e215]
      - generic [ref=e217]:
        - button "Abogado 1" [ref=e218]
        - button "Abogado 2" [ref=e219]
        - button "Abogado 3" [ref=e220]
      - paragraph [ref=e221]: 01 / 03
    - generic [ref=e225]:
      - generic [ref=e226]:
        - text: Especialidades
        - heading "Áreas de Práctica" [level=2] [ref=e227]
        - paragraph [ref=e228]: Asesoramiento integral en todas las ramas del derecho con profesionales especializados.
      - generic [ref=e230]:
        - generic [ref=e232] [cursor=pointer]:
          - img [ref=e234]
          - heading "Derecho Civil" [level=3] [ref=e237]
          - paragraph [ref=e238]: Contratos, responsabilidad civil, sucesiones y derechos reales.
        - generic [ref=e240] [cursor=pointer]:
          - img [ref=e242]
          - heading "Derecho Comercial" [level=3] [ref=e246]
          - paragraph [ref=e247]: Sociedades, concursos, quiebras y contratos comerciales.
        - generic [ref=e249] [cursor=pointer]:
          - img [ref=e251]
          - heading "Derecho Laboral" [level=3] [ref=e254]
          - paragraph [ref=e255]: Despidos, accidentes laborales, negociación colectiva.
        - generic [ref=e257] [cursor=pointer]:
          - img [ref=e259]
          - heading "Derecho Penal" [level=3] [ref=e265]
          - paragraph [ref=e266]: Defensa penal, querellas y delitos económicos.
        - generic [ref=e268] [cursor=pointer]:
          - img [ref=e270]
          - heading "Derecho de Familia" [level=3] [ref=e272]
          - paragraph [ref=e273]: Divorcios, alimentos, régimen de visitas y adopción.
        - generic [ref=e275] [cursor=pointer]:
          - img [ref=e277]
          - heading "Derecho Administrativo" [level=3] [ref=e279]
          - paragraph [ref=e280]: Licitaciones, contratos públicos y recursos administrativos.
        - generic [ref=e282] [cursor=pointer]:
          - img [ref=e284]
          - heading "Derecho Societario" [level=3] [ref=e289]
          - paragraph [ref=e290]: Constitución de sociedades, fusiones y adquisiciones.
        - generic [ref=e292] [cursor=pointer]:
          - img [ref=e294]
          - heading "Litigios Complejos" [level=3] [ref=e298]
          - paragraph [ref=e299]: Casos de alta complejidad con estrategia integral.
    - generic [ref=e303]:
      - generic [ref=e304]:
        - text: Contacto
        - heading "Consulta Inicial" [level=2] [ref=e305]
        - paragraph [ref=e306]: Contanos tu situación y te derivaremos con el profesional especializado.
      - generic [ref=e308]:
        - generic [ref=e309]:
          - generic [ref=e310]:
            - img [ref=e312]
            - generic [ref=e315]:
              - paragraph [ref=e316]: Dirección
              - paragraph [ref=e317]: Av. Corrientes 1234, Piso 8, CABA
          - generic [ref=e318]:
            - img [ref=e320]
            - generic [ref=e322]:
              - paragraph [ref=e323]: Teléfono
              - paragraph [ref=e324]: (011) 4567-8900
          - generic [ref=e325]:
            - img [ref=e327]
            - generic [ref=e330]:
              - paragraph [ref=e331]: Email
              - paragraph [ref=e332]: contacto@burgos.com.ar
          - generic [ref=e333]:
            - img [ref=e335]
            - generic [ref=e338]:
              - paragraph [ref=e339]: Horario
              - paragraph [ref=e340]: Lun a Vie, 9:00 a 18:00
          - iframe [ref=e342]:
            - link "Maps (opens in new tab)" [ref=f1e4] [cursor=pointer]:
              - /url: about:invalid#zClosurez
              - text: Maps
              - img [ref=f1e6]
        - generic [ref=e344]:
          - generic [ref=e345]:
            - generic [ref=e346]:
              - generic [ref=e347]: Nombre completo
              - textbox "Juan Pérez" [ref=e348]
            - generic [ref=e349]:
              - generic [ref=e350]: Email
              - textbox "juan@email.com" [ref=e351]
          - generic [ref=e352]:
            - generic [ref=e353]:
              - generic [ref=e354]: Teléfono
              - textbox "(011) 1234-5678" [ref=e355]
            - generic [ref=e356]:
              - generic [ref=e357]: Área de consulta
              - combobox [ref=e358]:
                - option "Seleccionar área" [selected]
                - option "Derecho Civil"
                - option "Derecho Comercial"
                - option "Derecho Laboral"
                - option "Derecho Penal"
                - option "Derecho de Familia"
                - option "Derecho Administrativo"
                - option "Derecho Societario"
                - option "Otro"
          - generic [ref=e359]:
            - generic [ref=e360]: Describí tu consulta
            - textbox "Contanos brevemente tu situación..." [ref=e361]
          - button "Enviar Consulta" [ref=e362]:
            - text: Enviar Consulta
            - img [ref=e363]
  - contentinfo [ref=e366]:
    - generic [ref=e368]:
      - generic [ref=e369]:
        - img "Burgos & Asociados" [ref=e370]
        - generic [ref=e371]: Burgos & Asociados
      - generic [ref=e372]:
        - link "Newsletter" [ref=e373] [cursor=pointer]:
          - /url: /newsletter
        - link "Equipo" [ref=e374] [cursor=pointer]:
          - /url: "#equipo"
        - link "Áreas" [ref=e375] [cursor=pointer]:
          - /url: "#areas"
        - link "Contacto" [ref=e376] [cursor=pointer]:
          - /url: "#contacto"
      - paragraph [ref=e377]: © 2026 Burgos & Asociados
  - button "Abrir chat" [ref=e378]:
    - img [ref=e379]
  - alert [ref=e381]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Landing pública", () => {
  4  |   test("carga la página principal", async ({ page }) => {
  5  |     await page.goto("/");
  6  |     await expect(page).toHaveTitle(/Burgos/);
  7  |   });
  8  | 
  9  |   test("muestra el hero con el nombre del estudio", async ({ page }) => {
  10 |     await page.goto("/");
  11 |     await expect(page.locator("h1")).toContainText("Burgos");
  12 |   });
  13 | 
  14 |   test("navbar tiene links de navegación", async ({ page }) => {
  15 |     await page.goto("/");
> 16 |     await expect(page.locator('a[href="#equipo"]')).toBeVisible();
     |                                                     ^ Error: expect(locator).toBeVisible() failed
  17 |     await expect(page.locator('a[href="#areas"]')).toBeVisible();
  18 |     await expect(page.locator('a[href="#contacto"]')).toBeVisible();
  19 |   });
  20 | 
  21 |   test("sección de áreas de práctica visible", async ({ page }) => {
  22 |     await page.goto("/");
  23 |     await expect(page.locator("#areas")).toBeVisible();
  24 |     await expect(page.locator("text=Áreas de Práctica")).toBeVisible();
  25 |   });
  26 | 
  27 |   test("formulario de contacto funciona", async ({ page }) => {
  28 |     await page.goto("/");
  29 |     const form = page.locator("#contacto form");
  30 |     await expect(form).toBeVisible();
  31 |     await expect(form.locator('input[type="text"]').first()).toBeVisible();
  32 |   });
  33 | 
  34 |   test("chat widget aparece", async ({ page }) => {
  35 |     await page.goto("/");
  36 |     await expect(page.locator('button[aria-label="Abrir chat"]')).toBeVisible();
  37 |   });
  38 | 
  39 |   test("página de newsletter carga", async ({ page }) => {
  40 |     await page.goto("/newsletter");
  41 |     await expect(page.locator("h1")).toContainText("Newsletter");
  42 |   });
  43 | });
  44 | 
  45 | test.describe("SEO", () => {
  46 |   test("robots.txt accesible", async ({ page }) => {
  47 |     const response = await page.goto("/robots.txt");
  48 |     expect(response?.status()).toBe(200);
  49 |   });
  50 | 
  51 |   test("sitemap.xml accesible", async ({ page }) => {
  52 |     const response = await page.goto("/sitemap.xml");
  53 |     expect(response?.status()).toBe(200);
  54 |   });
  55 | 
  56 |   test("ERP no indexable en robots.txt", async ({ page }) => {
  57 |     const response = await page.goto("/robots.txt");
  58 |     const text = await response?.text();
  59 |     expect(text).toContain("/erp/");
  60 |   });
  61 | });
  62 | 
```