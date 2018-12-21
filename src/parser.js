"use strict";

let P = require("parsimmon");

function token(parser) {
  return parser.skip(P.optWhitespace);
}

function word(str) {
  return P.string(str).thru(token);
}

let PDDL = P.createLanguage({

  lparen: () => word("("),
  rparen: () => word(")"),

  Domain: function(r) {
    return r.lparen
      .then(word("define"))
      .then(r.lparen)
      .then(P.seq(
        word("domain"),
        r.Name.skip(r.rparen),
        r.ExtensionDef.atMost(1)
      ))
      .skip(r.rparen);
  },

  ExtensionDef: function(r) {
    return r.lparen.then(P.seq(
        word(":extends"),
        r.Name
    )).skip(r.rparen);
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
