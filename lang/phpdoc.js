'use strict'
var refractorJavadoclike = require('./javadoclike.js')
module.exports = phpdoc
phpdoc.displayName = 'phpdoc'
phpdoc.aliases = []
function phpdoc(Prism) {
  Prism.register(refractorJavadoclike)
  ;(function(Prism) {
    var typeExpression = /(?:[a-zA-Z]\w*|[|\\[\]])+/.source
    Prism.languages.phpdoc = Prism.languages.extend('javadoclike', {
      parameter: {
        pattern: RegExp(
          '(@(?:global|param|property(?:-read|-write)?|var)\\s+(?:' +
            typeExpression +
            '\\s+)?)\\$\\w+'
        ),
        lookbehind: true
      }
    })
    Prism.languages.insertBefore('phpdoc', 'keyword', {
      'class-name': [
        {
          pattern: RegExp(
            '(@(?:global|package|param|property(?:-read|-write)?|return|subpackage|throws|var)\\s+)' +
              typeExpression
          ),
          lookbehind: true,
          inside: {
            keyword: /\b(?:callback|resource|boolean|integer|double|object|string|array|false|float|mixed|bool|null|self|true|void|int)\b/,
            punctuation: /[|\\[\]()]/
          }
        }
      ]
    })
    Prism.languages.javadoclike.addSupport('php', Prism.languages.phpdoc)
  })(Prism)
}
