# ![](.readme/patternbot-logo.png) Patternbot

*Your pompous and persnickety patterning robot.*

There are lots of fantastic tools for creating style guides and pattern libraries—but they all have a lot of embedded knowledge (command line, Gulp, Grunt, PHP, Handlebars, SASS, etc.)

It’s just too much *stuff* for my students. I don’t want them to have to learn the tool, I want them to use a tool and get on with designing.

My aim is not to replace the wonderful tools that exist, but simplify them into a very minimal GUI package that can get the students familiarized with using style guides without having to learn all the extra stuff.

---

## Ideas for folder structure

Inspired by lots of other tools that exist.

```
common/
  modules.css
  grid.css             Determine all sizes and create sample layouts.
  type.css             Create a preview using the standard classes.
  theme.css            Use CSS variables inside `:root {}` to define colours & fonts.
elements/
  buttons/
    index.html
    main.css
    README.md          Could contain element info? Why? Rational?
  lists/
    unordered.html     Each file would be used to generate the examples.
    ordered.html
    main.css
    main.js            JS should also be supported.
components/
  header/
    index.html
    main.css
  footer/
    index.html
    main.css 
images/
  icons.svg            Parse all the <symbol> tags and generate icon previews.
  logo.svg
  banner.jpg
pages/
  home.html
  about.html
styleguide.html        The final output. A single HTML file with necessary CSS & JS embedded.
```

---

## Questions

- Without a preprocessor how do we include all the CSS on the example pages?
  - Link every file at the top?
  - Have Patternbot generate a concatenated file?
- Should Patternbot include a web server? Browsersync?

---

## Resources

After looking through tonnes of resources these are the things that stick out to me as inspiration.

### Articles

- **https://24ways.org/2016/designing-imaginative-style-guides/**
- http://styleguides.io/articles.html
- https://www.smashingmagazine.com/2015/04/an-in-depth-overview-of-living-style-guide-tools/
- https://www.smashingmagazine.com/2015/03/automating-style-guide-driven-development/
- http://atomicdesign.bradfrost.com/resources/
- http://danielmall.com/articles/content-display-patterns/
- https://css-tricks.com/design-systems-building-future/
- http://alistapart.com/article/from-pages-to-patterns-an-exercise-for-everyone
- https://www.smashingmagazine.com/2016/12/how-creating-a-design-language-can-streamline-your-ux-design-process/

### Tools

- https://fbrctr.github.io/
- http://livingstyleguide.devbridge.com/
- https://github.com/cloudfour/drizzle
- http://demo.patternlab.io/?p=all
- https://hugeinc.github.io/styleguide/index.html
- https://github.com/bjankord/Style-Guide-Boilerplate
- http://barebones.paulrobertlloyd.com/
- https://trulia.github.io/hologram/
- https://bjankord.github.io/Style-Guide-Boilerplate/
- http://brettjankord.com/projects/style-guide-boilerplate/
- https://github.com/fbrctr/fabricator-assemble
- https://browsersync.io/

### Examples

- http://rizzo.lonelyplanet.com/styleguide/design-elements/colours
- https://standards.usa.gov/
- http://primercss.io/scaffolding/
- http://www.bbc.co.uk/gel
- http://clearleft.com/styleguide
- http://patternprimer.adactio.com/
- https://editorially.github.io/styleguide/
- https://www.ibm.com/design/language/
- https://www.yelp.com/styleguide
- http://solid.buzzfeed.com/
- http://ux.mailchimp.com/patterns/navigation
- https://www.mapbox.com/base/
- http://primercss.io/layout/
- https://walmartlabs.github.io/web-style-guide/#icons
- http://patterns.alistapart.com/
- http://oli.jp/2011/style-guide/
- https://projects.invisionapp.com/boards/MX1IZXSBQ3AY7
