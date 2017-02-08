# Changelog

This file documents all the notable changes for each version of Patternbot.
Patternbot adheres to [Semantic Versioning](http://semver.org/).

---

## [1.0.3] — 2017-02-08

### Fixed

- Added some error checking and made it a little more forgiving when errors are encountered.

---

## [1.0.2] — 2017-02-07

### Fixed

- PostCSS & CSSNext were smushing away some important variables—change the `browsers` option to allow more variables in the CSS.

---

## [1.0.1] — 2017-02-06

### Fixed

- Added support for CSS colour names—previously it threw an error message.
- Added a little space after the smaller colour swatches.
- The secondary font faces were displaying in the primary font.
- The accent font faces wouldn’t work properly because it was treated as a single item instead of an array.
- Some interface typographic details were being overwritten by the CSS of the `theme.css`—they are now set with very specific sizes.
- Made the font weight handling a little more fluid and forgiving.

---

## [1.0.0] — 2017-02-05

### Added

- Initial release of the Patternbot desktop app.
