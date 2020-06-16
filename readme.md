# refractor

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

Lightweight, robust, elegant virtual syntax highlighting using [Prism][].
Useful for virtual DOMs and non-HTML things.
Perfect for [React][], [VDOM][], and others.

<!--count start-->

`refractor` is built to work with all syntaxes supported by [Prism][],
that’s [209 languages][names] (as of [prism@1.20.0][prismjs]) and all
[themes][].

<!--count end-->

Want to use [`highlight.js`][hljs] instead?
Try [`lowlight`][lowlight]!

## Contents

*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`refractor.register(syntax)`](#refractorregistersyntax)
    *   [`refractor.alias(name[, alias])`](#refractoraliasname-alias)
    *   [`refractor.highlight(value, language)`](#refractorhighlightvalue-language)
    *   [`refractor.registered(language)`](#refractorregisteredlanguage)
    *   [`refractor.listLanguages()`](#refractorlistlanguages)
*   [Browser](#browser)
*   [Plugins](#plugins)
*   [Syntaxes](#syntaxes)
*   [Related](#related)
*   [Projects](#projects)

## Install

[npm][]:

```sh
npm install refractor
```

[Use in the browser »][browser]

## Use

```js
var refractor = require('refractor')

var nodes = refractor.highlight('"use strict";', 'js')

console.log(nodes)
```

Yields:

```js
[ { type: 'element',
    tagName: 'span',
    properties: { className: [ 'token', 'string' ] },
    children: [ { type: 'text', value: '"use strict"' } ] },
  { type: 'element',
    tagName: 'span',
    properties: { className: [ 'token', 'punctuation' ] },
    children: [ { type: 'text', value: ';' } ] } ]
```

Or, serialized with [rehype][]:

```js
var rehype = require('rehype')

var html = rehype()
  .stringify({type: 'root', children: nodes})
  .toString()

console.log(html)
```

Yields:

```html
<span class="token string">"use strict"</span><span class="token punctuation">;</span>
```

> **Tip**: Use [`hast-to-hyperscript`][to-hyperscript] to transform to other
> virtual DOMs, or DIY.

## API

### `refractor.register(syntax)`

Register a [syntax][].
Needed if you’re using [`refractor/core.js`][browser].

###### Example

```js
var refractor = require('refractor/core.js')
var markdown = require('refractor/lang/markdown.js')

refractor.register(markdown)

console.log(refractor.highlight('*Emphasis*', 'markdown'))
```

Yields:

```js
[ { type: 'element',
    tagName: 'span',
    properties: [Object],
    children: [Array] } ]
```

### `refractor.alias(name[, alias])`

Register a new `alias` for the `name` language.

###### Signatures

*   `alias(name, alias|list)`
*   `alias(aliases)`

###### Parameters

*   `name` (`string`) — [Name][names] of a registered language
*   `alias` (`string`) — New alias for the registered language
*   `list` (`Array.<alias>`) — List of aliases
*   `aliases` (`Object.<alias|list>`) — Map where each key is a `name` and each
    value an `alias` or a `list`

###### Example

```js
var refractor = require('./core')
var markdown = require('./lang/markdown')

refractor.register(markdown)

// refractor.highlight('*Emphasis*', 'mdown')
// ^ would throw: Error: Unknown language: `mdown` is not registered

refractor.alias({markdown: ['mdown', 'mkdn', 'mdwn', 'ron']})
refractor.highlight('*Emphasis*', 'mdown')
// ^ Works!
```

### `refractor.highlight(value, language)`

Parse `value` (`string`) according to the `language` ([name or alias][syntax])
syntax.

###### Returns

Virtual nodes representing the highlighted value ([`Array.<Node>`][node]).

###### Example

```js
var refractor = require('refractor/core.js')

console.log(refractor.highlight('em { color: red }', 'css'))
```

Yields:

```js
[ { type: 'element',
    tagName: 'span',
    properties: [Object],
    children: [Array] },
  { type: 'text', value: ' ' },
  // ...
  { type: 'text', value: ' red ' },
  { type: 'element',
    tagName: 'span',
    properties: [Object],
    children: [Array] } ]
```

### `refractor.registered(language)`

Check if a `language` ([name or alias][syntax]) is registered.

###### Example

```js
var refractor = require('refractor/core.js')
var markdown = require('refractor/lang/markdown.js')

console.log(refractor.registered('markdown'))

refractor.register(markdown)

console.log(refractor.registered('markdown'))
```

Yields:

```js
false
true
```

### `refractor.listLanguages()`

List all registered languages ([names and aliases][syntax]).

###### Returns

`Array.<string>`.

###### Example

```js
var refractor = require('refractor/core.js')
var markdown = require('refractor/lang/markdown.js')

console.log(refractor.listLanguages())

refractor.register(markdown)

console.log(refractor.listLanguages())
```

Yields:

```js
[ 'markup',
  'xml',
  'html',
  'mathml',
  'svg',
  'css',
  'clike',
  'javascript',
  'js' ]
[ 'markup',
  'xml',
  'html',
  'mathml',
  'svg',
  'css',
  'clike',
  'javascript',
  'js',
  'markdown' ]
```

## Browser

I do not suggest using the [pre-bundled][releases] files or requiring
`refractor` itself in the browser as that would include a 376kb (139kb GZipped)
of code.

Instead require `refractor/core.js` and include only the needed syntaxes.
For example:

```js
var refractor = require('refractor/core.js')

refractor.register(require('refractor/lang/jsx.js'))

console.log(refractor.highlight('<Dropdown primary />', 'jsx'))
```

Yields:

```js
[ { type: 'element',
    tagName: 'span',
    properties: { className: [ 'token', 'tag' ] },
    children:
     [ { type: 'element',
         tagName: 'span',
         properties: { className: [ 'token', 'tag' ] },
         children:
          [ { type: 'element',
              tagName: 'span',
              properties: { className: [ 'token', 'punctuation' ] },
              children: [ { type: 'text', value: '<' } ] },
            { type: 'text', value: 'Dropdown' } ] },
       { type: 'text', value: ' ' },
       { type: 'element',
         tagName: 'span',
         properties: { className: [ 'token', 'attr-name' ] },
         children: [ { type: 'text', value: 'primary' } ] },
       { type: 'text', value: ' ' },
       { type: 'element',
         tagName: 'span',
         properties: { className: [ 'token', 'punctuation' ] },
         children: [ { type: 'text', value: '/>' } ] } ] } ]
```

…When using [browserify][] and minifying with [tinyify][] this results in
just 65kb of code (23kb with GZip).

## Plugins

`refractor` does not support Prism plugins:

1.  Prism plugins often deal with the DOM, not Prism tokens
2.  Prism is made using global variables instead of a module format, so all
    syntaxes below are custom built to work so you can `require` just what you
    need

## Syntaxes

All syntaxes are included if you `require('refractor')`.
If you’re using `refractor/core.js`, checked syntaxes are always included, but
unchecked syntaxes are not and must be `require`d and [`register`][register]ed.

Unlike in Prism, `cssExtras` and `phpExtras` are camel-cased instead of
dash-cased.

Only these custom built syntaxes will work with `refractor` because Prism’s own
syntaxes are made to work with global variables and are not requirable.

<!--support start-->

*   [x] [`clike`](https://github.com/wooorm/refractor/blob/main/lang/clike.js)
*   [x] [`css`](https://github.com/wooorm/refractor/blob/main/lang/css.js)
*   [x] [`javascript`](https://github.com/wooorm/refractor/blob/main/lang/javascript.js) — alias: `js`
*   [x] [`markup`](https://github.com/wooorm/refractor/blob/main/lang/markup.js) — alias: `xml`, `html`, `mathml`, `svg`
*   [ ] [`abap`](https://github.com/wooorm/refractor/blob/main/lang/abap.js)
*   [ ] [`abnf`](https://github.com/wooorm/refractor/blob/main/lang/abnf.js)
*   [ ] [`actionscript`](https://github.com/wooorm/refractor/blob/main/lang/actionscript.js)
*   [ ] [`ada`](https://github.com/wooorm/refractor/blob/main/lang/ada.js)
*   [ ] [`antlr4`](https://github.com/wooorm/refractor/blob/main/lang/antlr4.js) — alias: `g4`
*   [ ] [`apacheconf`](https://github.com/wooorm/refractor/blob/main/lang/apacheconf.js)
*   [ ] [`apl`](https://github.com/wooorm/refractor/blob/main/lang/apl.js)
*   [ ] [`applescript`](https://github.com/wooorm/refractor/blob/main/lang/applescript.js)
*   [ ] [`aql`](https://github.com/wooorm/refractor/blob/main/lang/aql.js)
*   [ ] [`arduino`](https://github.com/wooorm/refractor/blob/main/lang/arduino.js)
*   [ ] [`arff`](https://github.com/wooorm/refractor/blob/main/lang/arff.js)
*   [ ] [`asciidoc`](https://github.com/wooorm/refractor/blob/main/lang/asciidoc.js) — alias: `adoc`
*   [ ] [`asm6502`](https://github.com/wooorm/refractor/blob/main/lang/asm6502.js)
*   [ ] [`aspnet`](https://github.com/wooorm/refractor/blob/main/lang/aspnet.js)
*   [ ] [`autohotkey`](https://github.com/wooorm/refractor/blob/main/lang/autohotkey.js)
*   [ ] [`autoit`](https://github.com/wooorm/refractor/blob/main/lang/autoit.js)
*   [ ] [`bash`](https://github.com/wooorm/refractor/blob/main/lang/bash.js) — alias: `shell`
*   [ ] [`basic`](https://github.com/wooorm/refractor/blob/main/lang/basic.js)
*   [ ] [`batch`](https://github.com/wooorm/refractor/blob/main/lang/batch.js)
*   [ ] [`bbcode`](https://github.com/wooorm/refractor/blob/main/lang/bbcode.js) — alias: `shortcode`
*   [ ] [`bison`](https://github.com/wooorm/refractor/blob/main/lang/bison.js)
*   [ ] [`bnf`](https://github.com/wooorm/refractor/blob/main/lang/bnf.js) — alias: `rbnf`
*   [ ] [`brainfuck`](https://github.com/wooorm/refractor/blob/main/lang/brainfuck.js)
*   [ ] [`brightscript`](https://github.com/wooorm/refractor/blob/main/lang/brightscript.js)
*   [ ] [`bro`](https://github.com/wooorm/refractor/blob/main/lang/bro.js)
*   [ ] [`c`](https://github.com/wooorm/refractor/blob/main/lang/c.js)
*   [ ] [`cil`](https://github.com/wooorm/refractor/blob/main/lang/cil.js)
*   [ ] [`clojure`](https://github.com/wooorm/refractor/blob/main/lang/clojure.js)
*   [ ] [`cmake`](https://github.com/wooorm/refractor/blob/main/lang/cmake.js)
*   [ ] [`coffeescript`](https://github.com/wooorm/refractor/blob/main/lang/coffeescript.js) — alias: `coffee`
*   [ ] [`concurnas`](https://github.com/wooorm/refractor/blob/main/lang/concurnas.js) — alias: `conc`
*   [ ] [`cpp`](https://github.com/wooorm/refractor/blob/main/lang/cpp.js)
*   [ ] [`crystal`](https://github.com/wooorm/refractor/blob/main/lang/crystal.js)
*   [ ] [`csharp`](https://github.com/wooorm/refractor/blob/main/lang/csharp.js) — alias: `dotnet`, `cs`
*   [ ] [`csp`](https://github.com/wooorm/refractor/blob/main/lang/csp.js)
*   [ ] [`cssExtras`](https://github.com/wooorm/refractor/blob/main/lang/css-extras.js)
*   [ ] [`d`](https://github.com/wooorm/refractor/blob/main/lang/d.js)
*   [ ] [`dart`](https://github.com/wooorm/refractor/blob/main/lang/dart.js)
*   [ ] [`dax`](https://github.com/wooorm/refractor/blob/main/lang/dax.js)
*   [ ] [`diff`](https://github.com/wooorm/refractor/blob/main/lang/diff.js)
*   [ ] [`django`](https://github.com/wooorm/refractor/blob/main/lang/django.js) — alias: `jinja2`
*   [ ] [`dnsZoneFile`](https://github.com/wooorm/refractor/blob/main/lang/dns-zone-file.js)
*   [ ] [`docker`](https://github.com/wooorm/refractor/blob/main/lang/docker.js) — alias: `dockerfile`
*   [ ] [`ebnf`](https://github.com/wooorm/refractor/blob/main/lang/ebnf.js)
*   [ ] [`eiffel`](https://github.com/wooorm/refractor/blob/main/lang/eiffel.js)
*   [ ] [`ejs`](https://github.com/wooorm/refractor/blob/main/lang/ejs.js)
*   [ ] [`elixir`](https://github.com/wooorm/refractor/blob/main/lang/elixir.js)
*   [ ] [`elm`](https://github.com/wooorm/refractor/blob/main/lang/elm.js)
*   [ ] [`erb`](https://github.com/wooorm/refractor/blob/main/lang/erb.js)
*   [ ] [`erlang`](https://github.com/wooorm/refractor/blob/main/lang/erlang.js)
*   [ ] [`etlua`](https://github.com/wooorm/refractor/blob/main/lang/etlua.js)
*   [ ] [`excelFormula`](https://github.com/wooorm/refractor/blob/main/lang/excel-formula.js)
*   [ ] [`factor`](https://github.com/wooorm/refractor/blob/main/lang/factor.js)
*   [ ] [`firestoreSecurityRules`](https://github.com/wooorm/refractor/blob/main/lang/firestore-security-rules.js)
*   [ ] [`flow`](https://github.com/wooorm/refractor/blob/main/lang/flow.js)
*   [ ] [`fortran`](https://github.com/wooorm/refractor/blob/main/lang/fortran.js)
*   [ ] [`fsharp`](https://github.com/wooorm/refractor/blob/main/lang/fsharp.js)
*   [ ] [`ftl`](https://github.com/wooorm/refractor/blob/main/lang/ftl.js)
*   [ ] [`gcode`](https://github.com/wooorm/refractor/blob/main/lang/gcode.js)
*   [ ] [`gdscript`](https://github.com/wooorm/refractor/blob/main/lang/gdscript.js)
*   [ ] [`gedcom`](https://github.com/wooorm/refractor/blob/main/lang/gedcom.js)
*   [ ] [`gherkin`](https://github.com/wooorm/refractor/blob/main/lang/gherkin.js)
*   [ ] [`git`](https://github.com/wooorm/refractor/blob/main/lang/git.js)
*   [ ] [`glsl`](https://github.com/wooorm/refractor/blob/main/lang/glsl.js)
*   [ ] [`gml`](https://github.com/wooorm/refractor/blob/main/lang/gml.js)
*   [ ] [`go`](https://github.com/wooorm/refractor/blob/main/lang/go.js)
*   [ ] [`graphql`](https://github.com/wooorm/refractor/blob/main/lang/graphql.js)
*   [ ] [`groovy`](https://github.com/wooorm/refractor/blob/main/lang/groovy.js)
*   [ ] [`haml`](https://github.com/wooorm/refractor/blob/main/lang/haml.js)
*   [ ] [`handlebars`](https://github.com/wooorm/refractor/blob/main/lang/handlebars.js)
*   [ ] [`haskell`](https://github.com/wooorm/refractor/blob/main/lang/haskell.js) — alias: `hs`
*   [ ] [`haxe`](https://github.com/wooorm/refractor/blob/main/lang/haxe.js)
*   [ ] [`hcl`](https://github.com/wooorm/refractor/blob/main/lang/hcl.js)
*   [ ] [`hpkp`](https://github.com/wooorm/refractor/blob/main/lang/hpkp.js)
*   [ ] [`hsts`](https://github.com/wooorm/refractor/blob/main/lang/hsts.js)
*   [ ] [`http`](https://github.com/wooorm/refractor/blob/main/lang/http.js)
*   [ ] [`ichigojam`](https://github.com/wooorm/refractor/blob/main/lang/ichigojam.js)
*   [ ] [`icon`](https://github.com/wooorm/refractor/blob/main/lang/icon.js)
*   [ ] [`inform7`](https://github.com/wooorm/refractor/blob/main/lang/inform7.js)
*   [ ] [`ini`](https://github.com/wooorm/refractor/blob/main/lang/ini.js)
*   [ ] [`io`](https://github.com/wooorm/refractor/blob/main/lang/io.js)
*   [ ] [`j`](https://github.com/wooorm/refractor/blob/main/lang/j.js)
*   [ ] [`java`](https://github.com/wooorm/refractor/blob/main/lang/java.js)
*   [ ] [`javadoc`](https://github.com/wooorm/refractor/blob/main/lang/javadoc.js)
*   [ ] [`javadoclike`](https://github.com/wooorm/refractor/blob/main/lang/javadoclike.js)
*   [ ] [`javastacktrace`](https://github.com/wooorm/refractor/blob/main/lang/javastacktrace.js)
*   [ ] [`jolie`](https://github.com/wooorm/refractor/blob/main/lang/jolie.js)
*   [ ] [`jq`](https://github.com/wooorm/refractor/blob/main/lang/jq.js)
*   [ ] [`jsExtras`](https://github.com/wooorm/refractor/blob/main/lang/js-extras.js)
*   [ ] [`jsTemplates`](https://github.com/wooorm/refractor/blob/main/lang/js-templates.js)
*   [ ] [`jsdoc`](https://github.com/wooorm/refractor/blob/main/lang/jsdoc.js)
*   [ ] [`json`](https://github.com/wooorm/refractor/blob/main/lang/json.js)
*   [ ] [`json5`](https://github.com/wooorm/refractor/blob/main/lang/json5.js)
*   [ ] [`jsonp`](https://github.com/wooorm/refractor/blob/main/lang/jsonp.js)
*   [ ] [`jsx`](https://github.com/wooorm/refractor/blob/main/lang/jsx.js)
*   [ ] [`julia`](https://github.com/wooorm/refractor/blob/main/lang/julia.js)
*   [ ] [`keyman`](https://github.com/wooorm/refractor/blob/main/lang/keyman.js)
*   [ ] [`kotlin`](https://github.com/wooorm/refractor/blob/main/lang/kotlin.js)
*   [ ] [`latex`](https://github.com/wooorm/refractor/blob/main/lang/latex.js) — alias: `tex`, `context`
*   [ ] [`latte`](https://github.com/wooorm/refractor/blob/main/lang/latte.js)
*   [ ] [`less`](https://github.com/wooorm/refractor/blob/main/lang/less.js)
*   [ ] [`lilypond`](https://github.com/wooorm/refractor/blob/main/lang/lilypond.js)
*   [ ] [`liquid`](https://github.com/wooorm/refractor/blob/main/lang/liquid.js)
*   [ ] [`lisp`](https://github.com/wooorm/refractor/blob/main/lang/lisp.js)
*   [ ] [`livescript`](https://github.com/wooorm/refractor/blob/main/lang/livescript.js)
*   [ ] [`llvm`](https://github.com/wooorm/refractor/blob/main/lang/llvm.js)
*   [ ] [`lolcode`](https://github.com/wooorm/refractor/blob/main/lang/lolcode.js)
*   [ ] [`lua`](https://github.com/wooorm/refractor/blob/main/lang/lua.js)
*   [ ] [`makefile`](https://github.com/wooorm/refractor/blob/main/lang/makefile.js)
*   [ ] [`markdown`](https://github.com/wooorm/refractor/blob/main/lang/markdown.js) — alias: `md`
*   [ ] [`markupTemplating`](https://github.com/wooorm/refractor/blob/main/lang/markup-templating.js)
*   [ ] [`matlab`](https://github.com/wooorm/refractor/blob/main/lang/matlab.js)
*   [ ] [`mel`](https://github.com/wooorm/refractor/blob/main/lang/mel.js)
*   [ ] [`mizar`](https://github.com/wooorm/refractor/blob/main/lang/mizar.js)
*   [ ] [`monkey`](https://github.com/wooorm/refractor/blob/main/lang/monkey.js)
*   [ ] [`moonscript`](https://github.com/wooorm/refractor/blob/main/lang/moonscript.js) — alias: `moon`
*   [ ] [`n1ql`](https://github.com/wooorm/refractor/blob/main/lang/n1ql.js)
*   [ ] [`n4js`](https://github.com/wooorm/refractor/blob/main/lang/n4js.js)
*   [ ] [`nand2tetrisHdl`](https://github.com/wooorm/refractor/blob/main/lang/nand2tetris-hdl.js)
*   [ ] [`nasm`](https://github.com/wooorm/refractor/blob/main/lang/nasm.js)
*   [ ] [`neon`](https://github.com/wooorm/refractor/blob/main/lang/neon.js)
*   [ ] [`nginx`](https://github.com/wooorm/refractor/blob/main/lang/nginx.js)
*   [ ] [`nim`](https://github.com/wooorm/refractor/blob/main/lang/nim.js)
*   [ ] [`nix`](https://github.com/wooorm/refractor/blob/main/lang/nix.js)
*   [ ] [`nsis`](https://github.com/wooorm/refractor/blob/main/lang/nsis.js)
*   [ ] [`objectivec`](https://github.com/wooorm/refractor/blob/main/lang/objectivec.js)
*   [ ] [`ocaml`](https://github.com/wooorm/refractor/blob/main/lang/ocaml.js)
*   [ ] [`opencl`](https://github.com/wooorm/refractor/blob/main/lang/opencl.js)
*   [ ] [`oz`](https://github.com/wooorm/refractor/blob/main/lang/oz.js)
*   [ ] [`parigp`](https://github.com/wooorm/refractor/blob/main/lang/parigp.js)
*   [ ] [`parser`](https://github.com/wooorm/refractor/blob/main/lang/parser.js)
*   [ ] [`pascal`](https://github.com/wooorm/refractor/blob/main/lang/pascal.js) — alias: `objectpascal`
*   [ ] [`pascaligo`](https://github.com/wooorm/refractor/blob/main/lang/pascaligo.js)
*   [ ] [`pcaxis`](https://github.com/wooorm/refractor/blob/main/lang/pcaxis.js) — alias: `px`
*   [ ] [`perl`](https://github.com/wooorm/refractor/blob/main/lang/perl.js)
*   [ ] [`phpExtras`](https://github.com/wooorm/refractor/blob/main/lang/php-extras.js)
*   [ ] [`php`](https://github.com/wooorm/refractor/blob/main/lang/php.js)
*   [ ] [`phpdoc`](https://github.com/wooorm/refractor/blob/main/lang/phpdoc.js)
*   [ ] [`plsql`](https://github.com/wooorm/refractor/blob/main/lang/plsql.js)
*   [ ] [`powerquery`](https://github.com/wooorm/refractor/blob/main/lang/powerquery.js)
*   [ ] [`powershell`](https://github.com/wooorm/refractor/blob/main/lang/powershell.js)
*   [ ] [`processing`](https://github.com/wooorm/refractor/blob/main/lang/processing.js)
*   [ ] [`prolog`](https://github.com/wooorm/refractor/blob/main/lang/prolog.js)
*   [ ] [`properties`](https://github.com/wooorm/refractor/blob/main/lang/properties.js)
*   [ ] [`protobuf`](https://github.com/wooorm/refractor/blob/main/lang/protobuf.js)
*   [ ] [`pug`](https://github.com/wooorm/refractor/blob/main/lang/pug.js)
*   [ ] [`puppet`](https://github.com/wooorm/refractor/blob/main/lang/puppet.js)
*   [ ] [`pure`](https://github.com/wooorm/refractor/blob/main/lang/pure.js)
*   [ ] [`python`](https://github.com/wooorm/refractor/blob/main/lang/python.js) — alias: `py`
*   [ ] [`q`](https://github.com/wooorm/refractor/blob/main/lang/q.js)
*   [ ] [`qml`](https://github.com/wooorm/refractor/blob/main/lang/qml.js)
*   [ ] [`qore`](https://github.com/wooorm/refractor/blob/main/lang/qore.js)
*   [ ] [`r`](https://github.com/wooorm/refractor/blob/main/lang/r.js)
*   [ ] [`reason`](https://github.com/wooorm/refractor/blob/main/lang/reason.js)
*   [ ] [`regex`](https://github.com/wooorm/refractor/blob/main/lang/regex.js)
*   [ ] [`renpy`](https://github.com/wooorm/refractor/blob/main/lang/renpy.js)
*   [ ] [`rest`](https://github.com/wooorm/refractor/blob/main/lang/rest.js)
*   [ ] [`rip`](https://github.com/wooorm/refractor/blob/main/lang/rip.js)
*   [ ] [`roboconf`](https://github.com/wooorm/refractor/blob/main/lang/roboconf.js)
*   [ ] [`robotframework`](https://github.com/wooorm/refractor/blob/main/lang/robotframework.js)
*   [ ] [`ruby`](https://github.com/wooorm/refractor/blob/main/lang/ruby.js) — alias: `rb`
*   [ ] [`rust`](https://github.com/wooorm/refractor/blob/main/lang/rust.js)
*   [ ] [`sas`](https://github.com/wooorm/refractor/blob/main/lang/sas.js)
*   [ ] [`sass`](https://github.com/wooorm/refractor/blob/main/lang/sass.js)
*   [ ] [`scala`](https://github.com/wooorm/refractor/blob/main/lang/scala.js)
*   [ ] [`scheme`](https://github.com/wooorm/refractor/blob/main/lang/scheme.js)
*   [ ] [`scss`](https://github.com/wooorm/refractor/blob/main/lang/scss.js)
*   [ ] [`shellSession`](https://github.com/wooorm/refractor/blob/main/lang/shell-session.js)
*   [ ] [`smalltalk`](https://github.com/wooorm/refractor/blob/main/lang/smalltalk.js)
*   [ ] [`smarty`](https://github.com/wooorm/refractor/blob/main/lang/smarty.js)
*   [ ] [`solidity`](https://github.com/wooorm/refractor/blob/main/lang/solidity.js)
*   [ ] [`solutionFile`](https://github.com/wooorm/refractor/blob/main/lang/solution-file.js)
*   [ ] [`soy`](https://github.com/wooorm/refractor/blob/main/lang/soy.js)
*   [ ] [`sparql`](https://github.com/wooorm/refractor/blob/main/lang/sparql.js) — alias: `rq`
*   [ ] [`splunkSpl`](https://github.com/wooorm/refractor/blob/main/lang/splunk-spl.js)
*   [ ] [`sqf`](https://github.com/wooorm/refractor/blob/main/lang/sqf.js)
*   [ ] [`sql`](https://github.com/wooorm/refractor/blob/main/lang/sql.js)
*   [ ] [`stylus`](https://github.com/wooorm/refractor/blob/main/lang/stylus.js)
*   [ ] [`swift`](https://github.com/wooorm/refractor/blob/main/lang/swift.js)
*   [ ] [`t4Cs`](https://github.com/wooorm/refractor/blob/main/lang/t4-cs.js)
*   [ ] [`t4Templating`](https://github.com/wooorm/refractor/blob/main/lang/t4-templating.js)
*   [ ] [`t4Vb`](https://github.com/wooorm/refractor/blob/main/lang/t4-vb.js)
*   [ ] [`tap`](https://github.com/wooorm/refractor/blob/main/lang/tap.js)
*   [ ] [`tcl`](https://github.com/wooorm/refractor/blob/main/lang/tcl.js)
*   [ ] [`textile`](https://github.com/wooorm/refractor/blob/main/lang/textile.js)
*   [ ] [`toml`](https://github.com/wooorm/refractor/blob/main/lang/toml.js)
*   [ ] [`tsx`](https://github.com/wooorm/refractor/blob/main/lang/tsx.js)
*   [ ] [`tt2`](https://github.com/wooorm/refractor/blob/main/lang/tt2.js)
*   [ ] [`turtle`](https://github.com/wooorm/refractor/blob/main/lang/turtle.js)
*   [ ] [`twig`](https://github.com/wooorm/refractor/blob/main/lang/twig.js)
*   [ ] [`typescript`](https://github.com/wooorm/refractor/blob/main/lang/typescript.js) — alias: `ts`
*   [ ] [`vala`](https://github.com/wooorm/refractor/blob/main/lang/vala.js)
*   [ ] [`vbnet`](https://github.com/wooorm/refractor/blob/main/lang/vbnet.js)
*   [ ] [`velocity`](https://github.com/wooorm/refractor/blob/main/lang/velocity.js)
*   [ ] [`verilog`](https://github.com/wooorm/refractor/blob/main/lang/verilog.js)
*   [ ] [`vhdl`](https://github.com/wooorm/refractor/blob/main/lang/vhdl.js)
*   [ ] [`vim`](https://github.com/wooorm/refractor/blob/main/lang/vim.js)
*   [ ] [`visualBasic`](https://github.com/wooorm/refractor/blob/main/lang/visual-basic.js)
*   [ ] [`wasm`](https://github.com/wooorm/refractor/blob/main/lang/wasm.js)
*   [ ] [`wiki`](https://github.com/wooorm/refractor/blob/main/lang/wiki.js)
*   [ ] [`xeora`](https://github.com/wooorm/refractor/blob/main/lang/xeora.js) — alias: `xeoracube`
*   [ ] [`xojo`](https://github.com/wooorm/refractor/blob/main/lang/xojo.js)
*   [ ] [`xquery`](https://github.com/wooorm/refractor/blob/main/lang/xquery.js)
*   [ ] [`yaml`](https://github.com/wooorm/refractor/blob/main/lang/yaml.js) — alias: `yml`
*   [ ] [`zig`](https://github.com/wooorm/refractor/blob/main/lang/zig.js)

<!--support end-->

## Related

*   [`lowlight`][lowlight] — Same, but based on [`highlight.js`][hljs]

## Projects

*   [`react-syntax-highlighter`](https://github.com/conorhastings/react-syntax-highlighter)
    — [React][] component for syntax highlighting
*   [`rehype-prism`](https://github.com/mapbox/rehype-prism)
    — Syntax highlighting in [**rehype**](https://github.com/rehypejs/rehype)
*   [`react-refractor`](https://github.com/rexxars/react-refractor)
    — Syntax highlighter for [React][]

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/wooorm/refractor.svg

[build]: https://travis-ci.org/wooorm/refractor

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/refractor.svg

[coverage]: https://codecov.io/github/wooorm/refractor

[downloads-badge]: https://img.shields.io/npm/dm/refractor.svg

[downloads]: https://www.npmjs.com/package/refractor

[size-badge]: https://img.shields.io/bundlephobia/minzip/refractor.svg

[size]: https://bundlephobia.com/result?p=refractor

[npm]: https://www.npmjs.com/package/refractor/tutorial

[license]: license

[author]: https://wooorm.com

[releases]: https://github.com/wooorm/refractor/releases

[rehype]: https://github.com/rehypejs/rehype

[names]: https://prismjs.com/#languages-list

[themes]: https://prismjs.com/#theme

[react]: https://facebook.github.io/react/

[vdom]: https://github.com/Matt-Esch/virtual-dom

[to-hyperscript]: https://github.com/syntax-tree/hast-to-hyperscript

[browser]: #browser

[prism]: https://github.com/PrismJS/prism

[prismjs]: https://www.npmjs.com/package/prismjs

[lowlight]: https://github.com/wooorm/lowlight

[hljs]: https://github.com/isagalaev/highlight.js

[browserify]: https://github.com/browserify/browserify

[tinyify]: https://github.com/browserify/tinyify

[node]: https://github.com/syntax-tree/hast#ast

[syntax]: #syntaxes

[register]: #refractorregistersyntax
