# Sistema de Tokens

Repositorio propio del sistema de design tokens del curso. Un token no es un valor: es **una decisión con nombre**. Este repo convierte los valores dispersos del login (y del resto de `styles/`) en datos con nombre, organizados en tres capas, con reglas de consumo claras.

**Integrante:** Ramirez Cantero, Francisco Uriel

> *"Design tokens are a methodology for expressing design decisions in a platform-agnostic way so that they can be shared across different disciplines, tools, and technologies. They help establish a common vocabulary across organizations."*
> — Design Tokens Community Group, *Design Tokens Format Module 2025.10*, Introducción.

---

## Estructura

```
/styles
  /tokens
    _primitives.css     (capa 1 - primitivos)
    _semantic.css       (capa 2 - semánticos + tema oscuro)
    _component.css      (capa 3 - componente)
    _spacing.css        (escala compartida de espaciado/dimensiones)
    _radius.css         (escala compartida de radios)
    _reset.css          (reset del curso - declara el orden de @layer)
  global.css            (imports en orden: reset → capas → fuentes)
  styles.css            (login refactorizado, sin valores mágicos)
Auth.jsx                (sin cambios: importa ../styles/styles.css)
README.md
```

Nota: `styles.css` vive dentro de `styles/` (misma estructura que el repositorio base); `Auth.jsx` lo importa desde ahí.

---

## Las tres capas

| Capa | Archivo | Pregunta que responde | Cambiarlo cambia... |
| --- | --- | --- | --- |
| 1 — Primitivos | `_primitives.css` (+ `_spacing.css`, `_radius.css`) | ¿Qué valores/tamaños existen? | **La marca** |
| 2 — Semánticos | `_semantic.css` | ¿Para qué sirve? | **El tema** |
| 3 — Componente | `_component.css` | ¿Qué usa este widget? | **Un componente** |

- **Capa 1:** valores crudos. Paleta de color, escalas de tipografía, sombras crudas. Sin una línea de semántica. (El archivo anterior mezclaba capas: `--color-brand-primary` apuntaba a variables comentadas que no existían; eso se limpió.)
- **Capa 2:** roles. Cada token declara una intención (`--color-surface`, `--color-action`, `--spacing-form-gap`, `--radius-control`, `--font-size-heading`…) y **apunta siempre a la capa 1**. Acá vive el bloque `:root[data-theme="dark"]`.
- **Capa 3:** uso específico de un widget (`--card-radius`, `--hero-bg`, `--button-bg`, `--input-radius`…) y **apunta siempre a la capa 2**.

### Reglas de consumo

1. **Una decisión = un lugar.** Si un valor está escrito a mano dos veces, es un bug de sistema.
2. Los componentes (`styles.css`, `global.css`, `components/`) usan **capa 2, capa 3 y las escalas compartidas** (`--space-*`, `--size-*`, `--pct-*`, `--radius-*`).
3. Los componentes **nunca** referencian los primitivos de `_primitives.css` (`--color-blue-500`, `--text-16`, `--font-regular`, `--shadow-card-raw`…). Esos nombres sólo existen detrás de la capa 2.
4. **Sin valores mágicos:** ningún `#hex` ni `px` escrito a mano en los componentes. Única excepción: los breakpoints de `@media (max-width: 768px)` / `480px`, porque las variables CSS no pueden usarse dentro de condiciones de media query.
5. `@layer`: `_reset.css` declara el orden `@layer reset, base, components, utilities;`. Los archivos de tokens viven en `@layer base`; las reglas de componentes quedan sin capa para preservar exactamente el cascade del repo base. `global.css` importa `_reset.css` primero.

---

## La cadena de referencia (primitivo → componente)

El ejemplo obligatorio: el fondo del hero del login.

```css
/* capa 1 — _primitives.css : el valor crudo, una sola vez */
--color-blue-500: #046bd2;

/* capa 2 — _semantic.css : la intención "esto es el acento de marca" */
--color-accent: var(--color-blue-500);

/* capa 3 — _component.css : el uso "este es el fondo del hero" */
--hero-bg: var(--color-accent);

/* styles.css : el componente sólo consume la capa 3 */
.card-bg {
  background: var(--hero-bg);
}
```

El hex vive **una sola vez**. Si mañana la marca es naranja, se cambia `--color-blue-500` (o se re-apunta `--color-accent`) en la capa 1/2 y **todo** el sistema — hero, acentos, botón del modo oscuro — se mueve sin tocar un componente.

---

## Cómo cambiar el tema

El modo claro es el default (los valores de `:root` en `_semantic.css`). El modo oscuro se activa con `data-theme="dark"` en `<html>` y **sólo redefinir tokens de la capa semántica** (bloque `:root[data-theme="dark"]` al final de `_semantic.css`).

En la consola de DevTools, con la página del login abierta:

```js
// modo oscuro
document.documentElement.setAttribute('data-theme', 'dark');

// volver al modo claro
document.documentElement.removeAttribute('data-theme');
```

O de forma permanente, en el `<html>` del documento:

```html
<html lang="es" data-theme="dark">
```

Criterio de aceptación cumplido: **el dark mode se logra cambiando sólo `_semantic.css`** — `_primitives.css`, `_component.css` y los componentes no se tocan. Lo que cambia en el bloque oscuro: superficies (`--color-bg`, `--color-surface`, `--color-surface-raised`…), texto, bordes (blanco al 10 %), la acción pasa a azul de marca con texto blanco y las sombras a `none`.

## Cómo cambiar la marca

Editar **sólo** `_primitives.css`. Por ejemplo, cambiar `--color-blue-500` actualiza la cadena completa (accent → hero → componentes) y también el modo oscuro, porque la capa 2 oscura apunta a los mismos primitivos.

---

## Notas de migración (honestidad del refactor)

- **Hero restaurado:** en el repo base `.card-bg` no tenía `background` y el texto del hero era casi invisible sobre el gris de la card. Se restauró el fondo azul de marca vía `--hero-bg` (decisión del equipo).
- **`global.css` estaba roto:** usaba `--congregational-blue`, `--declaration-*` y `--size-*` que no existían en ningún lado (propiedades inválidas = valores caídos). Se resolvieron contra el sistema (`--size-N` → escala `--space-N` equivalentes). Esas reglas pasaron de rotas a funcionales.
- **Consolidaciones:** los fondos de input se unificaron en `--color-surface-input`; los grises de texto en `--color-text`; el acento de sidebar/header en `--color-accent` (azul de marca). `components/_sidebar.css` perdió su bloque `.page.dark` propio: el tema ahora lo maneja sólo `data-theme`.
- **Sombra del botón** de `global.css`: `0 0 var(--size-2) rgba(...)` era inválida; hoy es `--form-button-shadow` → `--shadow-glow`.

---

## Citas de autoridad

> *"Design tokens are a methodology for expressing design decisions in a platform-agnostic way so that they can be shared across different disciplines, tools, and technologies. They help establish a common vocabulary across organizations."*
> — Design Tokens Community Group (2026). *Design Tokens Format Module 2025.10* (Draft Community Group Report, 08 de septiembre de 2026), Introducción.

*Demostración de lectura:* el módulo define el token como par nombre/valor (§3.1) y permite que el valor sea una referencia a otro token (§3.8), que es exactamente lo que hace la cadena `--color-blue-500 → --color-accent → --hero-bg` de este repo; la promesa de "vocabulario común entre disciplinas" es la razón por la que los nombres viven en un archivo compartido y no en la cabeza de quien diseñó la pantalla.

> *"Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes. We use them in place of hard-coded values (such as hex values for color or pixel values for spacing) in order to maintain a scalable and consistent visual system for UI development."*
> — Salesforce (s.f.). *Design Tokens*. Lightning Design System.

*Demostración de lectura:* "visual design atoms" explica el tiering: los primitivos son el átomo (`#046bd2`), la capa 2 le da el rol, la capa 3 el uso; "in place of hard-coded values" es literalmente el trabajo de este repo: todo `#hex` y `px` que estaba en `styles.css` hoy vive en una capa de tokens.

> *"Core tokens are global colors that are used across components. They are named and grouped by the common UI element that they are applied to."*
> — IBM (2026, 25 de septiembre). *Color*. Carbon Design System.

*Demostración de lectura:* "named and grouped by the common UI element" describe nuestra capa 3: los tokens se agrupan por widget (`--card-*`, `--button-*`, `--input-*`, `--hero-*`), no por valor; y "global colors used across components" describe la capa 2, que todos los componentes comparten sin repetir valores.

> *"I chose not to release this CSS reset as an NPM package because I feel like you should own your reset."*
> — Comeau, J. W. (2021, 23 de noviembre; actualizado 2026, 3 de junio). *A Modern CSS Reset*.

*Demostración de lectura:* (cita obligatoria para todos) Es la tesis de este entregable: **un sistema de tokens se posee, no se consume**. No importamos un paquete cerrado de tokens; el sistema está escrito a mano en este repositorio, con el reset del curso (`_reset.css`, basado en el mismo trabajo de Comeau) declarando el orden de `@layer` que respetamos. El sistema crece con el equipo porque el equipo lo posee.

---

## Fuente propia de investigación

**Figma. (s.f.). *Create and manage variables and collections*. Figma Help Center.** Recuperado de https://help.figma.com/hc/en-us/articles/15145852043927

> *"Create an alias for a variable to link its value to an existing variable. This allows you to implement design tokens and makes managing updates to your designs more efficient."*
> — Figma, *Create and manage variables and collections*.

*Demostración de lectura:* leí el flujo completo del artículo y lo cruzo con este sistema en cuatro puntos concretos:

1. **Alias.** El artículo crea aliases con click derecho → *Create alias* → pestaña *Libraries*, y advierte: *"If that color needs updating, you would only need to update the source instead of manually updating every instance of the color."* Esa es exactamente nuestra cadena `var()`: el hex se actualiza una vez en la capa 1 y se propaga.
2. **Scopes (alcance).** La pestaña *Scope* limita en qué propiedades puede usarse una variable (un número scoping a *corner radius* no aparece para rellenos; un color a *frame fill / shape fill / stroke / text fill*). Es el equivalente de diseño de nuestra regla "los componentes sólo consumen capa 2 y 3": el alcance evita el uso indebido del valor crudo.
3. **Modes.** Cada variable puede tener varias columnas (modos) con valores distintos, reordenables y con modo por defecto. Nuestro `:root[data-theme="dark"]` es un modo que sólo reescribe la capa 2; en Figma sería una columna *Dark* en la colección de tokens semánticos.
4. **Code syntax.** El editor permite definir sintaxis por plataforma (Web, Android, iOS) y en Dev Mode el código CSS muestra `var(--extra-small)`. Es la misma convención que usamos acá: el nombre del token en Figma y el `var(--...)` en el CSS hablan el mismo idioma.

---

## Referencias

- Design Tokens Community Group. (2026). *Design Tokens Format Module 2025.10*. https://www.designtokens.org/TR/2025.10/format/
- Salesforce. (s.f.). *Design Tokens*. Lightning Design System. https://www.lightningdesignsystem.com/design-tokens/
- IBM. (2026, 25 de septiembre). *Color*. Carbon Design System. https://carbondesignsystem.com/elements/color/tokens/
- Tailwind Labs. (2026). *Theme variables*. Tailwind CSS v4. https://tailwindcss.com/docs/theme
- Comeau, J. W. (2021/2026). *A Modern CSS Reset*. https://www.joshwcomeau.com/css/custom-css-reset/
- Figma. (s.f.). *Create and manage variables and collections*. https://help.figma.com/hc/en-us/articles/15145852043927
- Material Design 3. *Design tokens*. https://m3.material.io/foundations/design-tokens/overview
- Adobe. *Spectrum tokens*. https://spectrum.adobe.com/page/tokens/
- Tokens Studio. *Tokens*. https://docs.tokens.studio/
- Shopify. *Polaris tokens*. https://polaris.shopify.com/tokens/colors
