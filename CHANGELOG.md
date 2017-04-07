# Changelog

This file documents all the notable changes for each version of Patternbot.
Patternbot adheres to [Semantic Versioning](http://semver.org/).

---

## [Unreleased]

### Added

- The output file can now be customized so it isn’t always named `pattern-library.html`. It can be changed to `index.html` for easier library loading.
- Code blocks are now collapsed by default and can be expanded with a button.
- A button to copy the code samples from each pattern.

### Fixed

- Prevented horizontal scrolling in the pattern library.
- Fixed the weird jumping bug when pressing the left nav (also much worse when pressing the tool buttons)—it was caused by iFrameResizer’s `autoResize` property.

---

## [1.3.1] — 2017-03-28

### Changed

- Added a small robot illustration to the start screen to differentiate Patternbot from the other Toolbots.

---

## [1.3.0] — 2017-03-25

### Added

- Support for pages by looking for `*.html` in the `pages` folder.
- Allow for background colour customization of built-in sections & more in-depth background colour customization of patterns.
- Allow multi-file pattern README (with YAML) when it’s a single-file pattern.

### Changed

- Changed the button focus styles to be more nicely styled and not quite as abrasive.

### Fixed

- Fixed the `iframe` height calculations by using the maximum height value.

---

## [1.2.0] — 2017-03-11

### Added

- Automatic regeneration and browser refreshing.
- The ability to pop-out patterns into their own tab for easier styling.
- Pattern READMEs can now set the width for individual patterns.
- Patterns can now be resized with drag-to-resize handles.
- Allow a background colour to be assigned for the whole pattern library that changes the interface to match.
- Allow a background colour to be assigned for a single pattern.

### Changed

- Pattern READMEs now can be just the description (a string) or also include meta data (an object).
- Simplified the pattern group sub-nav so it didn’t conflict design-wise with the patterns themselves.
- The company’s name is now written at the top of the navigation.

### Fixed

- Stopped the keyboard shortcuts from firing multiple times.
- Humanized the Typekit font names.
- When a secondary typeface isn’t used the information section disappears properly.
- Customized `::before` bullets don’t show in Patternbot default styles now.
- Fixed build process for the new version of Electron Builder.

---

## [1.1.2] — 2017-02-13

### Fixed

- Fixed some style collisions when designing typography and adding patterns.

---

## [1.1.1] — 2017-02-11

### Changed

- Real small CSS reorganization in the app interface.
- Signed the app with an Apple Developer Certificate.

---

## [1.1.0] — 2017-02-11

### Added

- Added support for Typekit fonts with the ability to specify weights and styles.
- Allow rationals for fonts & colours inside the main README file.

### Changed

- Changed the MacOS “Add Folder…” menu item to have consistent wording with Windows.
- Added a few more large letter samples to the typeface displays.

### Fixed

- Fixed a bug when the wrong code was inside a Web Dev Tool URL it was still tried to parse.
- Fixed a bug where the navigation menu showed the Web Dev Tools when they could not be parsed.

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
