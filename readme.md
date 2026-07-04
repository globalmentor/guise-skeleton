# Guise™ Skeleton

The simple, semantic, bare-bones CSS to hold your site together.

[Guise Skeleton](https://guise.dev/skeleton/) is part of the [Guise™ Internet application suite](https://guise.dev/).

## Overview

Guise Skeleton is a CSS framework that provides bare-bones structural styling rather than opinionated visuals. Customization is driven by semantic [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) (e.g. `--skelt-card-border-color`) rather than low-level selector overrides, so you can restyle components without digging into the framework internals.

Most CSS frameworks are all-or-nothing: once included, their styles apply everywhere and may conflict with other libraries or legacy CSS. Guise Skeleton avoids this with two class-naming modes. The recommended approach is to add the `guise-skeleton` class to a parent element (typically `<html>`), which activates concise classes like `card` and `is-striped` for all descendants. If you need to mix Guise Skeleton with another framework on the same page, you can instead use the verbose form, where every class carries the `skelt-` prefix (e.g. `skelt-card`, `skelt-is-striped`), ensuring no naming collisions.

### Components

Components are high-level, semantic UI widgets. Each provides minimal structural style and exposes custom properties for further customization.

* **Avatar** — a small, fixed-size profile image with a decorative crop.
* **Button** — a control for initiating an action or navigating to a link.
* **Card** — a self-contained information box for summaries or status. It sets a background but no text color, so on a colored surface it may need an explicit `color` to stay legible.
* **Hero** — a landing-page banner, the first visual encounter with a site; fills the viewport by default, sized on the block axis through the [size scale](#sizing).
* **Menu** — a list of items for selection.
* **Navbar** — a typically horizontal area for navigation items such as a menu.
* **Page** — a full-height container for a [Holy Grail layout](#page-layout), framing a content area between a fitted header and footer.
* **Pane** — an image of dynamically reduced size serving as a smaller preview.
* **Panel** — a lightweight section of content or grouping of components.
* **Rotulus** — a vertical roll of sections, ideal for landing pages. Even-positioned sections are striped when the roll carries `is-striped`.
* **Table** — the standard HTML table, rebooted and made more flexible.
* **Thumbnail** — an image of dynamically reduced size serving as a tiny preview.

### Layouts

Layouts determine how children are arranged within a container. All layout classes begin with `layout-`.

* **`layout-brick`** — children use only the space they need, laid out sequentially like bricks, wrapping if needed.
* **`layout-flex`** — a flexible, responsive layout where children grow to fill the remaining space and wrap when needed.
* **`layout-marquee`** — children are centered on both axes, like the words on a marquee.
* **`layout-tile`** — children use only the space they need, with remaining space distributed around them; tiles carry no row gap when they wrap.

The flex layout takes two container modifiers: `along-block` orients children vertically, and `focalized` centers them on the main axis. A child of a flex container can carry `lay-fitted` to opt out of growing and take its natural size, letting its siblings fill the remainder; when the container is a vertical (`along-block`) `<section>`, its `<header>` and `<footer>` children are fitted automatically. Container classes use the `layout-` prefix and child modifiers the `lay-` prefix.

### Sizing

Guise Skeleton defines a single semantic size scale, used wherever a component takes a proportional size — the height of a hero, the width of a floated element. A component multiplies the scale's factor by whatever base is meaningful for it, such as the viewport height or the containing-block width.

| Step | Factor |
|---|---|
| `marginal` | 0.11 |
| `subordinate` | 0.22 |
| `significant` | 0.33 |
| `partial` | 0.50 |
| `substantial` | 0.66 |
| `full` | 1.00 |

Each step is applied as a class in three forms — `size-subordinate` for an exact size, `min-size-subordinate` for a floor, and `max-size-subordinate` for a ceiling — while `size-auto` turns off proportional sizing so the element fits its content. Every step is also exposed as the custom properties `--skelt-size-subordinate-factor` (the raw fraction) and `--skelt-size-subordinate` (the fraction as a percentage).

### Customization

Guise Skeleton exposes a hierarchy of `--skelt-*` custom properties. Setting a high-level property such as `--skelt-component-border-color` changes the default for all components that inherit it; setting a specific property such as `--skelt-card-border-color` overrides only that component. The [size scale](#sizing) properties follow the same model. See the [Guise Skeleton documentation](https://guise.dev/skeleton/docs/properties) for the full property reference.

## Page Layout

A typical page is composed as a [Holy Grail layout](https://en.wikipedia.org/wiki/Holy_grail_(web_design)): a full-height column whose header and footer stay at their natural size while the main content fills the space between. Mark the page element — usually `<body>` — as a vertical flex `page`, and fit the header and footer so they do not grow:

```html
<body class="page layout-flex along-block">
  <header class="lay-fitted">…</header>
  <main>…</main>
  <footer class="lay-fitted">…</footer>
</body>
```

Because every unfitted child of the vertical flex page grows to fill the remaining height, a `hero` placed directly in the page column expands to fill it, overriding its own size setting. To hold the hero to the size set by the scale, fit it — apply `lay-fitted` to the hero, or place it within a fitted element such as the `<header>`.

## Building Guise™ Skeleton

Clean the project and run a full build by invoking:

```
npm run clean && npm run build
```

The build produces the following artifacts:

* `dist/css/*.css`: Source CSS files for distribution.
* `dist/css/*.min.css`: Minimized CSS files for distribution.
* `dist/css/*.min.css.map`: Map files for debugging minimized CSS files.
* `target/guise-skeleton-x-x-x.zip`: Archive of distributable files listed above.

### Clean

Removes all build artifacts.

```
npm run clean
```

### Test

Runs project tests.

```
npm run test
```

### Build

Performs a full build, including tests, minification, and packaging.

```
npm run build
```

### Publishing

Inspect the file list that will be published:

```
npm pack --dry-run
```

To publish to npm:

```
npm publish
```

The `prepublishOnly` script automatically runs `clean`, `test`, and `build`, so `npm publish` cannot succeed without a fresh, tested build. It also refuses to publish if the version is still a `-SNAPSHOT` development version.

During development the version is set to a `-SNAPSHOT` suffix (e.g. `0.2.0-SNAPSHOT`). Before publishing, the version must be set to a clean release version. Use `npm version` to change it without creating a Git tag:

```
npm version 0.2.0 --no-git-tag-version
```

## Using Guise™ Skeleton

### Bundler Import

Install the package:

```
npm install @guise/skeleton
```

Then import the aggregate stylesheet (JS entry for bundlers that support CSS imports):

```js
import "@guise/skeleton";
```

Or from CSS:

```css
@import "@guise/skeleton";
```

Individual components are available as subpath imports:

```css
@import "@guise/skeleton/base";
@import "@guise/skeleton/layout";
@import "@guise/skeleton/button";
```

The minified aggregate bundle is available as `@guise/skeleton/min`.

### Direct File Reference

Install the package and reference the stylesheet directly from `node_modules/`:

```html
<link href="node_modules/@guise/skeleton/dist/css/guise-skeleton.min.css" rel="stylesheet" />
```

This is useful for projects that do not run a bundler over CSS.

### CDN

Use the package directly from a CDN without installing anything:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@guise/skeleton@x.y.z/dist/css/guise-skeleton.min.css" />
```

Or via unpkg:

```html
<link rel="stylesheet" href="https://unpkg.com/@guise/skeleton@x.y.z/dist/css/guise-skeleton.min.css" />
```

### Activation

Enable Guise Skeleton across the page by specifying the `guise-skeleton` class on the document `<html>` element.

```html
<!DOCTYPE html>
<html class="guise-skeleton">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Example Page</title>
  <link href="path/to/guise-skeleton.min.css" rel="stylesheet" />
</head>
…
```

Alternatively you can mix-and-match only the Guise Skeleton components you want by including individual stylesheet files:

* `bootstrap-reboot.min.css` (or replace with the [reset](https://meyerweb.com/eric/tools/css/reset/) or [normalize](https://necolas.github.io/normalize.css/) stylesheet of your choice)
* `guise-skeleton-base.min.css` (required)
* `guise-skeleton-layout.min.css` (recommended)
* Individual Guise Skeleton components such as `guise-skeleton-button.min.css`.

See the [Getting Started](https://guise.dev/skeleton/docs/start) guide for more detailed instructions.
