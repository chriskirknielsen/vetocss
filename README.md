# VetoCSS
Remove style blocks matching a specific selector from a stylesheet.

## Installation
Run the following command:

```bash
npm install vetocss
```

And require it in your script like so:

```js
const vetoCss = require('vetocss');
```

## Usage
With a stylesheet text content and an array of selectors (`string` or `RegExp`), you can remove blocklisted CSS:

```js
vetoCss(stylesheet, [
    'p.warning',
    /\.opacity-(25|50)+/
]);
```

This would turn this stylesheet:

```css
body { color: navy; }
.warning { color: red; }
p.warning { padding: 1em; }
.opacity-0 { opacity: 0; }
.opacity-25 { opacity: 0.25; }
.opacity-50 { opacity: 0.50; }
.opacity-75 { opacity: 0.75; }
.opacity-100 { opacity: 1; }
```

… into the following:

```css
body { color: navy; }
.warning { color: red; }
.opacity-0 { opacity: 0; }
.opacity-50 { opacity: 0.50; }
.opacity-100 { opacity: 1; }
```

## Caveats

### Media queries and other at-rules
This current implementation does not distinguish between inside or outside a media query or other `@`-rules.

### Working on minified stylesheets
If used in a build process, keep in mind that minification tools will likely modify some more complex selectors, for example:
- spaces are removed for combinators (except for the general descendant combinator — a space): `.parent > .child a` turns into `.parent>.child a`
- attribute selectors can get unquoted: `[href="#"]` turns into `[href=#]`

If you want to remove a style block for a complex selector, you can either strategically run `vetoCss` at a predictable point of your build (say after minification) to consistently target a minified selector via a string, or you can provide a regular expression targetting both states, if you are uncertain of the state of the stylesheet when VetoCSS is running. Additionally, you can provide both, that works, too.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)