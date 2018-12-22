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

// An optional parser
function opt(parser) {
  return parser.or(P.of([]));
}

function typedListOf(parser) {
  return parser.sepBy(P.optWhitespace);
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

        opt(r.ExtensionDef),
        opt(r.ConstantsDef),
        opt(r.PredicatesDef)
      )));
  },

  ExtensionDef: function(r) {
    return withParens(P.seq(word(":extends"), r.Name.sepBy(P.optWhitespace)));
  },

  // TODO: RequireDef
  // TODO: RequireKey
  // TODO: TypesDef
  
  ConstantsDef: function(r) {
    return withParens(P.seq(word(":constants"), typedListOf(r.Name)));
  },

  PredicatesDef: function(r) {
    return withParens(P.seq(word(":predicates"), typedListOf(r.AtomicFormulaSkeleton)));
  },

  AtomicFormulaSkeleton: function(r) {
    return withParens(P.seq(r.Name.skip(P.optWhitespace), typedListOf(r.Variable)));
  },

  Variable: function(r) {
    return P.string("?").then(r.Name);
  },

  // Spec reference: McDermott 1998, page 7
  Name: function() {
    return P.regexp(/[a-zA-Z][a-zA-Z0-9-_]*/)
      .desc("name");
  },

  File: function(r) {
    return P.optWhitespace.then(r.Domain.many());
  },

});

module.exports = {
  parse: function(text) {
    let ast = PDDL.File.tryParse(text);
    return ast;
  }
};
