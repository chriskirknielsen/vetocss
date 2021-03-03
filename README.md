# VetoCSS
Remove style blocks matching a specific selector from a stylesheet.

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
### Working on minified stylesheets
Keep in mind that minification tools will likely modify some more complex selectors, for example:
- spaces are removed for combinators (except for the general descendant, which is a space): `.parent > .child` turns into `.parent>.child`
- attribute selectors can get unquoted: `[href="#"]` turns into `[href=#]`

If you want to remove a style block for a complex selector, you can either strategically use `vetoCss` at a predictable point (say after minification) to consistently target a minified selector via a string, or you can provide a regular expression if you are uncertain of the state of the stylesheet when VetoCSS is running.

### Media Queries
This current implementation does not distinguish between inside or outside a media query. If you need this degree of control, please submit a pull request to implement the feature.