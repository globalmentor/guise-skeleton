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
* **Card** — a self-contained information box for summaries or status.
* **Hero** — a landing-page component taking up the entire page.
* **Menu** — a list of items for selection.
* **Navbar** — a typically horizontal area for navigation items such as a menu.
* **Page** — a general full-page component, useful for Holy Grail layouts.
* **Pane** — an image of dynamically reduced size serving as a smaller preview.
* **Panel** — a lightweight section of content or grouping of components.
* **Rotulus** — a vertical roll of sections, ideal for landing pages.
* **Table** — the standard HTML table, rebooted and made more flexible.
* **Thumbnail** — an image of dynamically reduced size serving as a tiny preview.

### Layouts

Layouts determine how children are arranged within a container. All layout classes begin with `layout-`.

* **`layout-brick`** — children use only the space they need, laid out sequentially like bricks, wrapping if needed.
* **`layout-flex`** — a flexible, responsive layout where children fill remaining space and wrap when needed.
* **`layout-marquee`** — children are centered on both axes, like the words on a marquee.
* **`layout-tile`** — children use only the space they need, with remaining space distributed around them.

### Customization

Guise Skeleton exposes a hierarchy of `--skelt-*` custom properties. Setting a high-level property such as `--skelt-component-border-color` changes the default for all components that inherit it; setting a specific property such as `--skelt-card-border-color` overrides only that component. See the [Guise Skeleton documentation](https://guise.dev/skeleton/docs/properties) for the full property reference.

## Building Guise™ Skeleton

Clean the project and run a full build by invoking:

```
npm run clean && npm run build
```

The build produces the following artifacts:

* `dist/css/*.css`: Source CSS files for distribution.
* `dist/css/*-min.css`: Minimized CSS files for distribution.
* `dist/css/*-min.css.map`: Map files for debugging minimized CSS files.
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

## Using Guise™ Skeleton

The easiest way to use Guise Skeleton is to include _only_ the `dist/guise-skeleton.min.css` (which also can be found in target/guise-skeleton-x-x-x.zip) produced by the build process as a stylesheet on your web page. Enable Guise Skeleton across the page by specifying the `guise-skeleton` class on the document `<html>` element.

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
