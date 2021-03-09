# Google Variable Fonts Links

This is a sophisticated high-tech tool to construct links to the full variable fonts available on Google Fonts.

See the [full list in your browser!](pixelambacht.nl/google-variable-fonts-links/)

## Why?

Because Google Fonts does not yet disclose all axes in their web interface. So you have to hand-craft the correct URL to get a font with all the axes, which takes an amount of brainpower currently simply not available to mankind.

## How to run

Keep putting one leg in front of the other really fast. Haha! Anyway, how to run _the script:_

```bash
$ node getGFCSS.js
```

This will output the links to the CSS files for each font as a simple key/value set. It will also list the subsets, as they represent different fonts in the CSS.

```
{
    "Alegreya":{
        "css":"https://fonts.googleapis.com/css2?family=Alegreya:wght@400..900&display=block",
        "subsets":[
            "cyrillic",
            "cyrillic-ext",
            "greek",
            "greek-ext",
            "latin",
            "latin-ext",
            "vietnamese"
        ]
    },
    "Alegreya Italic":{
        "css":"https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@1,400..900&display=block",
        "subsets":[
            "cyrillic",
            "cyrillic-ext",
            "greek",
            "greek-ext",
            "latin",
            "latin-ext",
            "vietnamese"
        ]
    },

    ...snip...

    "Yanone Kaffeesatz":{
        "css":"https://fonts.googleapis.com/css2?family=Yanone%20Kaffeesatz:wght@200..700&display=block",
        "subsets":[
            "cyrillic",
            "latin",
            "latin-ext",
            "vietnamese"
        ]
    }
}
```

## How to get the fonts

Use the output from `getGFCSS.js` to get the URL for your favorite font's CSS. Fetch the CSS with a browser as Node doesn't work, presumably because a proper user agent string is missing from a Node request so you'll get a garbage CSS file with duplicated links to .ttf files.

Then parse the font URL you need from the returned CSS, and fetch the font file! An example for this can be found in `index.html`. If you'd like to get the `Vietnamese` subset of `Fraunces`, the returned URL will be something like `https://fonts.gstatic.com/s/fraunces/v7/6NUV8FyLNQOQZAnv9ZwHlOkuy91BRtw.woff2`. Note that the links to the fonts are for demonstration/debugging purposes onky and shouldn't be used directly. They are specifically generated for your browser/OS, and are prone to change!

## A note on subsets

Because the fonts are subset per script/language/Unicode block, you will only receive those specific fonts. So `latin-ext` will contain `Ā`, `ā`, `Ă`, `ă`, etc. but not `A` and `a`.
