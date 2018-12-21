"use strict";

let P = require("parsimmon");
let util = require("util");

function token(parser) {
  return parser.skip(P.optWhitespace);
}

function word(str) {
  return P.string(str).thru(token);
}

let PDDL = P.createLanguage({

  lparen: () => word("("),
  rparen: () => word(")"),

  List: r => r.lparen.then(r.Atom.sepBy(P.optWhitespace)).skip(r.rparen),

  Atom: function(r) {
    return P.alt(
      r.Name,
      r.List,
    );
  },

  // Spec reference: McDermott 1998, page 7
  Name: function() {
    return P.regexp(/[a-zA-Z:\?][a-zA-Z0-9-_]*/)
      .desc("name");
  },

  File: function(r) {
    return r.List.many();
  },

});

module.exports = {
  parse: function(text) {
    let ast = PDDL.File.tryParse(text);
    return ast;
  }
};
