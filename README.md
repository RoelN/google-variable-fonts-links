# Google Variable Fonts Links

This is a sophisticated high-tech tool to construct links to the full variable fonts available on Google Fonts.

## Why?

Because Google Fonts does not yet disclose all axes in their web interface. So you have to hand-craft the correct URL to get a font with all the axes, which takes an amount of brainpower currently simply not available to mankind.

## How to run

Keep putting one leg in front of the other really fast. Haha! Anyway, how to run _the script:_

```bash
$ node getGFCSS.js
```

This will output the links to the CSS files for each font as a simple key/value set.

## How to get the fonts

Use the output from `getGFCSS.js` to get the URL for your favorite font's CSS. Fetch the CSS with a browser, as Node doesn't work. Presumably because a proper user agent string is missing from a Node request, you'll get a garbage CSS file with links to .ttf files.

Then parse the link you want from the returned CSS, and fetch the font file! An example for this can be found in `index.html`.