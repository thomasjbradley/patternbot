# Changelog

This file documents all the notable changes for each version of Patternbot.
Patternbot adheres to [Semantic Versioning](http://semver.org/).

---

## [2.1.1] — 2018-02-06

### Changed

- Made the loading process for each iframe a little more clear by adding loading spinners.

### Fixed

- Patternbot is now more flexible when if finds validation errors in the `README.md` or in `theme.css`
- Patternbot is now more flexible with camel case capitalization inside the `README.md`
- The 64 pixel logo was being chosen as large instead of the 256 pixel logo.
- There’s a 10 second timeout on downloading font CSS files to prevent apparent interface hangs.
- Fixed an error when an improperly formatted hex number was trying to be converted to RGB.
- Styles attached to the `<p>` tag were overwriting the font-family display font-face.

---

## [2.1.0] — 2018-01-29

### Added

- PNG logos are now support along with SVG.
- Patternbot is now much more forgiving about missing content in `README.md` and `theme.css`.

### Changed

- The font size samples are now cannot wrap to prevent very large font scales to break the whole layout.

### Fixed

- The number of font sizes Typografier specifies is incorrect—it was made more general.
- Fixed an error creating folders inside the `patterns` folder when `patterns` didn’t exist.
- Patterns that are completely `position: fixed`, like nav bars, now render properly in Patternbot.

---

## [2.0.0] — 2018-01-28

### Added

- Patternbot’s interface now takes more cues from the colours and fonts to configure the design to better match the brand.
- Added a new `accentColour` option inside the README.md to help prevent color conflicts with the primary colour and the background colour.
- Added Typografier’s new, extra large font sizes to the display.
- The links to the Web Dev tools now link to the correct configuration URL.
- Patternbot will now generate proper `.markbot.yml` & `.markbotignore` files into each directory for easier Markbot testing.
- Typekit now works with the `fontUrl` entry inside the main `README.md` instead of a separate entry.

### Changed

- Patternbot watcher will now ignore the common Jekyll-related folders (`_site`, `_includes`, `_layouts`, etc.) when regenerating.
- Updated all the outdated dependencies.
- Updated to the newest versions of the Web Dev tools.
- Changed how the Google font weights & styles are detected by downloading the actual CSS file.

### Fixed

- Fixed some CSS collisions with user CSS and Patternbot CSS that caused mis-aligned text, weird colours, etc.
- Hex & RGBA colours will always be displayed in lowercase.
- Added a few missing CSS colour names.
- Fixed some inconsistencies in the capitalization of words in the navigation bar.
- Fixed a couple bugs in the short hex to long hex generator.
- Removed the underline from the start screen’s ampersand.

### Removed

- The `typekit` entry inside the main `README.md` has been removed in favour of reading the Typekit CSS file directly.

---

## [1.4.1] — 2017-04-24

### Fixed

- The pages links don’t work when launched to GitHub Pages or within a folder.

---

## [1.4.0] — 2017-04-07

### Added

- Performance improvements: not all the patterns are displayed by default, it acts more like tabs now. There is a “Show All” button to get back the older single-page style.
- The output file can now be customized so it isn’t always named `pattern-library.html`. It can be changed to `index.html` for easier library loading.
- Code blocks are now collapsed by default and can be expanded with a button.
- A button to copy the code samples from each pattern.
- The ability to copy colour variables, font variables and icon `<svg><use>` statements.

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
