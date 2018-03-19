# Changelog

This file documents all the notable changes for each version of Patternbot.
Patternbot adheres to [Semantic Versioning](http://semver.org/).

---

## [3.0.5] — 2018-03-19

### Fixed

- Fixed a bug in Safari related to the browser not supporting `addEventListener` on `matchMedia`
- Fixed a bug when pattern HTML files are named with sorting numbers, the Patternbot include copy button wasn’t copying the correct filename.
- Update to the new version of Patternbot Includes.

---

## [3.0.4] — 2018-03-11

### Changed

- Added the `meta generator` tag to all pattern libraries.
- Added the `meta description` tag to all pattern libraries.

### Fixed

- Removed an extraneous `console.log` call.

---

## [3.0.3] — 2018-03-10

### Changed

- Updated to the newest version of Patternbot Includes.

### Fixed

- Added a little more padding to the left & right sides of icons for when they have background colours.

---

## [3.0.2] — 2018-03-01

### Changed

- Relaxed the pages Markbot requirements in the root directory to match those in the pages directory.

### Fixed

- Fixed a regression in the previous version caused by the iframe’s injected CSS.
- Fixed a bug when the pattern had exactly the same ID as Patternbot’s primary navigation.
- Fixed spacing around loading gears and patterns on small screens.
- Changed the iframe height calculation to another method to fix a few bugs where iframes were too high.

---

## [3.0.1] — 2018-02-26

### Fixed

- The pattern padding was only working if a background colour was also specified.
- Removed the responsive margin-bottom from icons and made it a permanent margin for better support with icon background colours.

---

## [3.0.0] — 2018-02-24

### Added

- CSS files inside patterns are now found and gathered into a list.
- A complete manifest is now generated, but I decided that it wasn’t helpful to write it out to a file.
- Add the new Patternbot includes template system for use within pages.
- The secondary font is now used on the coloured headings in the pattern library for more brand visibility.
- Made the final pattern library responsive.
- Added the ability to customize the `background-color` of a single icon if it *must* be a specific colour.

### Changed

- Adjusted the build process to remove all MacOS extended attributes files before building.
- When the `background-color` of the icons section is changed, the icons default to their own colours, they aren’t customized to match the brand.

### Fixed

- Fixed a bug that caused duplicate brand folders to show and many unnecessary regenerations.
- Fixed the navigation in Safari.
- Fixed the code borders in Safari.

---

## [2.2.0] — 2018-02-15

### Added

- Colours inside the readmes can now be specified as CSS colour keywords, not just hex values.
- All readme properties now have alternative spellings, including dashed versions, for simple CSS-like consistency.
- Added a new `height` property that can be specified for individual patterns to force the `<iframe>` to a minimum height.
- Added a new `padding` property that can be specified for individual patterns to force their `<body>` tag to be padded—very use for patterns that include drop shadows.
- All colours specified inside readmes can now be specified using the CSS variables syntax, e.g. `--color-primary`

### Changed

- Moved to a single iframe loading gear instead of two because it’s less busy.
- Allow CSS-like dashed property names in readmes, e.g. `background-color` instead of just `backgroundColor`

### Fixed

- Fixed a typo in the menu IDs on Windows.
- Fixed the auto-rebuild system on Windows by changing from deleting folders to just emptying them.

---

## [2.1.2] — 2018-02-08

### Fixed

- Patternbot better handles incorrect YAML syntax within README files.

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
