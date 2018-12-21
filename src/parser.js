"use strict";

let P = require("parsimmon");

function token(parser) {
  return parser.skip(P.optWhitespace);
}

function word(str) {
  return P.string(str).thru(token);
}

// takes a parser, and returns a parser that requires parentheses () around it
function withParens(parser) {
  return word("(").then(parser).skip(word(")"));
}

let PDDL = P.createLanguage({

  lparen: () => word("("),
  rparen: () => word(")"),

  Domain: function(r) {
    return withParens(
      word("define")
      .then(r.lparen)
      .then(P.seq(
        word("domain"),
        r.Name.skip(r.rparen),
        r.ExtensionDef.atMost(1)
      )));
  },

  ExtensionDef: function(r) {
    return withParens(
      P.seq(
        word(":extends"),
        r.Name
      )
    );
  },

  // Spec reference: McDermott 1998, page 7
  Name: function() {
    return P.regexp(/[a-zA-Z][a-zA-Z0-9-_]*/)
      .desc("name");
  },

  File: function(r) {
    return r.Domain.many();
  },

});

module.exports = {
  parse: function(text) {
    let ast = PDDL.File.tryParse(text);
    return ast;
  }
};
