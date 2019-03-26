'use strict'

module.exports = json
json.displayName = 'json'
json.aliases = []
function json(Prism) {
  Prism.languages.json = {
    comment: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
    property: {
      pattern: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
      greedy: true
    },
    string: {
      pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
      greedy: true
    },
    number: /-?\d+\.?\d*(e[+-]?\d+)?/i,
    punctuation: /[{}[\],]/,
    operator: /:/,
    boolean: /\b(?:true|false)\b/,
    null: {
      pattern: /\bnull\b/,
      alias: 'keyword'
    }
  }
}
