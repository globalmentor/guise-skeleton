# Guise™ Skeleton

The simple, semantic, bare-bones CSS to hold your site together.

[Guise Skeleton](https://guise.dev/skeleton/) is part of the [Guise™ Internet application suite](https://guise.dev/).

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
