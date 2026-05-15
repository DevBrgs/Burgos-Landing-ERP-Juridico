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
        - paragraph [ref=e58]: Estudio Jurídico
        - paragraph [ref=e59]: Soluciones legales integrales con compromiso, experiencia y resultados. Innovación al servicio de la justicia.
        - generic [ref=e60]:
          - link "Consulta Inicial" [ref=e61] [cursor=pointer]:
            - /url: "#contacto"
            - text: Consulta Inicial
            - img [ref=e62]
          - link "Conocé al Equipo" [ref=e64] [cursor=pointer]:
            - /url: "#equipo"
      - generic [ref=e68]: Scroll
    - generic [ref=e73]:
      - generic [ref=e74]:
        - generic [ref=e75]:
          - text: Newsletter Jurídico
          - heading "Novedades" [level=2] [ref=e76]
          - paragraph [ref=e77]: Publicado por nuestros profesionales. Noticias, jurisprudencia, eventos y casos de éxito.
        - link "Ver todas las publicaciones" [ref=e78] [cursor=pointer]:
          - /url: /newsletter
          - text: Ver todas las publicaciones
          - img [ref=e79]
      - generic [ref=e81]:
        - article [ref=e82]:
          - link "Nuevas modificaciones al Código Procesal Civil y Comercial Novedades Normativas 10 May 2025 Nuevas modificaciones al Código Procesal Civil y Comercial Análisis de las recientes reformas que impactan en los plazos procesales y la tramitación de causas civiles en el ámbito nacional. Dr. Martín Burgos Leer más" [ref=e83] [cursor=pointer]:
            - /url: /newsletter/1
            - generic [ref=e84]:
              - img "Nuevas modificaciones al Código Procesal Civil y Comercial" [ref=e86]
              - generic [ref=e88]:
                - generic [ref=e89]:
                  - generic [ref=e90]: Novedades Normativas
                  - generic [ref=e91]:
                    - img [ref=e92]
                    - text: 10 May 2025
                - heading "Nuevas modificaciones al Código Procesal Civil y Comercial" [level=3] [ref=e95]
                - paragraph [ref=e96]: Análisis de las recientes reformas que impactan en los plazos procesales y la tramitación de causas civiles en el ámbito nacional.
                - generic [ref=e97]:
                  - generic [ref=e98]:
                    - img [ref=e99]
                    - text: Dr. Martín Burgos
                  - generic [ref=e102]:
                    - text: Leer más
                    - img [ref=e103]
        - generic [ref=e106]:
          - article [ref=e107]:
            - 'link "Caso de éxito: Indemnización por despido discriminatorio Casos de Éxito Caso de éxito: Indemnización por despido discriminatorio Dra. Laura Méndez 5 May 2025" [ref=e108] [cursor=pointer]':
              - /url: /newsletter/2
              - generic [ref=e109]:
                - 'img "Caso de éxito: Indemnización por despido discriminatorio" [ref=e111]'
                - generic [ref=e112]:
                  - generic [ref=e114]: Casos de Éxito
                  - 'heading "Caso de éxito: Indemnización por despido discriminatorio" [level=4] [ref=e115]'
                  - generic [ref=e116]:
                    - generic [ref=e117]:
                      - img [ref=e118]
                      - text: Dra. Laura Méndez
                    - generic [ref=e121]:
                      - img [ref=e122]
                      - text: 5 May 2025
          - article [ref=e125]:
            - 'link "Charla abierta: Derechos del consumidor en la era digital Eventos Charla abierta: Derechos del consumidor en la era digital Dra. Carolina Vega 1 May 2025" [ref=e126] [cursor=pointer]':
              - /url: /newsletter/3
              - generic [ref=e127]:
                - 'img "Charla abierta: Derechos del consumidor en la era digital" [ref=e129]'
                - generic [ref=e130]:
                  - generic [ref=e132]: Eventos
                  - 'heading "Charla abierta: Derechos del consumidor en la era digital" [level=4] [ref=e133]'
                  - generic [ref=e134]:
                    - generic [ref=e135]:
                      - img [ref=e136]
                      - text: Dra. Carolina Vega
                    - generic [ref=e139]:
                      - img [ref=e140]
                      - text: 1 May 2025
          - article [ref=e143]:
            - 'link "Actualización: Nuevos montos de UMA para regulación de honorarios Novedades Normativas Actualización: Nuevos montos de UMA para regulación de honorarios Dr. Alejandro Torres 28 Abr 2025" [ref=e144] [cursor=pointer]':
              - /url: /newsletter/4
              - generic [ref=e145]:
                - 'img "Actualización: Nuevos montos de UMA para regulación de honorarios" [ref=e147]'
                - generic [ref=e148]:
                  - generic [ref=e150]: Novedades Normativas
                  - 'heading "Actualización: Nuevos montos de UMA para regulación de honorarios" [level=4] [ref=e151]'
                  - generic [ref=e152]:
                    - generic [ref=e153]:
                      - img [ref=e154]
                      - text: Dr. Alejandro Torres
                    - generic [ref=e157]:
                      - img [ref=e158]
                      - text: 28 Abr 2025
          - article [ref=e161]:
            - 'link "Jurisprudencia: CSJN sobre prescripción en acciones laborales Jurisprudencia Jurisprudencia: CSJN sobre prescripción en acciones laborales Dra. Laura Méndez 22 Abr 2025" [ref=e162] [cursor=pointer]':
              - /url: /newsletter/5
              - generic [ref=e163]:
                - 'img "Jurisprudencia: CSJN sobre prescripción en acciones laborales" [ref=e165]'
                - generic [ref=e166]:
                  - generic [ref=e168]: Jurisprudencia
                  - 'heading "Jurisprudencia: CSJN sobre prescripción en acciones laborales" [level=4] [ref=e169]'
                  - generic [ref=e170]:
                    - generic [ref=e171]:
                      - img [ref=e172]
                      - text: Dra. Laura Méndez
                    - generic [ref=e175]:
                      - img [ref=e176]
                      - text: 22 Abr 2025
      - generic [ref=e180]:
        - generic [ref=e181]:
          - heading "Suscribite al resumen semanal" [level=3] [ref=e182]
          - paragraph [ref=e183]: Recibí las novedades legales más relevantes cada semana en tu casilla.
        - generic [ref=e184]:
          - textbox "tu@email.com" [ref=e185]
          - button "Suscribirme" [ref=e186]
    - generic [ref=e190]:
      - generic [ref=e191]:
        - text: Profesionales
        - heading "Nuestro Equipo" [level=2] [ref=e192]
      - generic [ref=e194]:
        - button "Anterior" [ref=e195]:
          - img [ref=e196]
        - button "Siguiente" [ref=e198]:
          - img [ref=e199]
        - generic [ref=e203]:
          - generic [ref=e206]: t
          - generic [ref=e207]:
            - heading "test" [level=3] [ref=e208]
            - paragraph [ref=e209]: asdas
            - paragraph [ref=e210]: "1231312"
            - generic [ref=e211]:
              - button "Reservar turno" [ref=e212]:
                - img [ref=e213]
                - text: Reservar turno
              - link "Ver perfil" [ref=e215] [cursor=pointer]:
                - /url: /equipo/4b8563e8-768b-48fa-b35f-f9750aa37ac5
                - text: Ver perfil
                - img [ref=e216]
      - generic [ref=e218]:
        - button "Abogado 1" [ref=e219]
        - button "Abogado 2" [ref=e220]
        - button "Abogado 3" [ref=e221]
      - paragraph [ref=e222]: 01 / 03
    - generic [ref=e226]:
      - generic [ref=e227]:
        - text: Especialidades
        - heading "Áreas de Práctica" [level=2] [ref=e228]
        - paragraph [ref=e229]: Asesoramiento integral en todas las ramas del derecho con profesionales especializados.
      - generic [ref=e231]:
        - generic [ref=e233] [cursor=pointer]:
          - img [ref=e235]
          - heading "Derecho Civil" [level=3] [ref=e238]
          - paragraph [ref=e239]: Contratos, responsabilidad civil, sucesiones y derechos reales.
        - generic [ref=e241] [cursor=pointer]:
          - img [ref=e243]
          - heading "Derecho Comercial" [level=3] [ref=e247]
          - paragraph [ref=e248]: Sociedades, concursos, quiebras y contratos comerciales.
        - generic [ref=e250] [cursor=pointer]:
          - img [ref=e252]
          - heading "Derecho Laboral" [level=3] [ref=e255]
          - paragraph [ref=e256]: Despidos, accidentes laborales, negociación colectiva.
        - generic [ref=e258] [cursor=pointer]:
          - img [ref=e260]
          - heading "Derecho Penal" [level=3] [ref=e266]
          - paragraph [ref=e267]: Defensa penal, querellas y delitos económicos.
        - generic [ref=e269] [cursor=pointer]:
          - img [ref=e271]
          - heading "Derecho de Familia" [level=3] [ref=e273]
          - paragraph [ref=e274]: Divorcios, alimentos, régimen de visitas y adopción.
        - generic [ref=e276] [cursor=pointer]:
          - img [ref=e278]
          - heading "Derecho Administrativo" [level=3] [ref=e280]
          - paragraph [ref=e281]: Licitaciones, contratos públicos y recursos administrativos.
        - generic [ref=e283] [cursor=pointer]:
          - img [ref=e285]
          - heading "Derecho Societario" [level=3] [ref=e290]
          - paragraph [ref=e291]: Constitución de sociedades, fusiones y adquisiciones.
        - generic [ref=e293] [cursor=pointer]:
          - img [ref=e295]
          - heading "Litigios Complejos" [level=3] [ref=e299]
          - paragraph [ref=e300]: Casos de alta complejidad con estrategia integral.
    - generic [ref=e304]:
      - generic [ref=e305]:
        - text: Contacto
        - heading "Consulta Inicial" [level=2] [ref=e306]
        - paragraph [ref=e307]: Contanos tu situación y te derivaremos con el profesional especializado.
      - generic [ref=e309]:
        - generic [ref=e310]:
          - generic [ref=e311]:
            - img [ref=e313]
            - generic [ref=e316]:
              - paragraph [ref=e317]: Dirección
              - paragraph [ref=e318]: 920 Dr. Rafael Castillo
          - generic [ref=e319]:
            - img [ref=e321]
            - generic [ref=e323]:
              - paragraph [ref=e324]: Teléfono
              - paragraph [ref=e325]: +54 9 3834645467
          - generic [ref=e326]:
            - img [ref=e328]
            - generic [ref=e331]:
              - paragraph [ref=e332]: Email
              - paragraph [ref=e333]: contacto@burgos.com.ar
          - generic [ref=e334]:
            - img [ref=e336]
            - generic [ref=e339]:
              - paragraph [ref=e340]: Horario
              - paragraph [ref=e341]: Lunes a Viernes, 9:00 a 18:00
          - iframe [ref=e343]:
            - link "Maps (opens in new tab)" [ref=f1e4] [cursor=pointer]:
              - /url: about:invalid#zClosurez
              - text: Maps
              - img [ref=f1e6]
        - generic [ref=e345]:
          - generic [ref=e346]:
            - generic [ref=e347]:
              - generic [ref=e348]: Nombre completo
              - textbox "Juan Pérez" [ref=e349]
            - generic [ref=e350]:
              - generic [ref=e351]: Email
              - textbox "juan@email.com" [ref=e352]
          - generic [ref=e353]:
            - generic [ref=e354]:
              - generic [ref=e355]: Teléfono
              - textbox "(011) 1234-5678" [ref=e356]
            - generic [ref=e357]:
              - generic [ref=e358]: Área de consulta
              - combobox [ref=e359]:
                - option "Seleccionar área" [selected]
                - option "Derecho Civil"
                - option "Derecho Comercial"
                - option "Derecho Laboral"
                - option "Derecho Penal"
                - option "Derecho de Familia"
                - option "Derecho Administrativo"
                - option "Derecho Societario"
                - option "Otro"
          - generic [ref=e360]:
            - generic [ref=e361]: Describí tu consulta
            - textbox "Contanos brevemente tu situación..." [ref=e362]
          - button "Enviar Consulta" [ref=e363]:
            - text: Enviar Consulta
            - img [ref=e364]
  - contentinfo [ref=e367]:
    - generic [ref=e369]:
      - generic [ref=e370]:
        - img "Burgos & Asociados" [ref=e371]
        - generic [ref=e372]: Burgos & Asociados
      - generic [ref=e373]:
        - link "Newsletter" [ref=e374] [cursor=pointer]:
          - /url: /newsletter
        - link "Equipo" [ref=e375] [cursor=pointer]:
          - /url: "#equipo"
        - link "Áreas" [ref=e376] [cursor=pointer]:
          - /url: "#areas"
        - link "Contacto" [ref=e377] [cursor=pointer]:
          - /url: "#contacto"
      - paragraph [ref=e378]: © 2026 Burgos & Asociados
  - button "Abrir chat" [ref=e379]:
    - img [ref=e380]
  - alert [ref=e382]
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