"use strict";

let P = require("parsimmon");
let pddl = require("./pddl.js");

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

  //--------------------------------------------------------------------------
  //--- Domain stuff ---------------------------------------------------------
  //--------------------------------------------------------------------------

  Domain: (r) => withParens(
      word("define")
      .then(r.lparen)
      .then(P.seq(
        word("domain"),
        r.Name.skip(r.rparen),

        opt(r.ExtensionDef),
        opt(r.ConstantsDef),
        opt(r.PredicatesDef),
        opt(r.ActionDef.many())
      ))),

  ExtensionDef: (r) => withParens(
    P.seq(
      word(":extends"),
      typedListOf(r.Name)
    )),

  // TODO: RequireDef
  // TODO: RequireKey
  // TODO: TypesDef

  ConstantsDef: (r) => withParens(
    P.seq(
      word(":constants"),
      typedListOf(r.Name)
    )),

  // TODO: DomainVarsDef

  PredicatesDef: (r) => withParens(
    P.seq(
      word(":predicates"),
      typedListOf(r.AtomicFormulaSkeleton)
    )),

  AtomicFormulaSkeleton: (r) => withParens(
    P.seq(
      r.Name.skip(P.optWhitespace),
      typedListOf(r.Variable)
    )).map((x) => new pddl.Predicate(x)),

  Variable: (r) => P.string("?").then(r.Name).map((x) => new pddl.Variable(x)),

  // TODO: TimelessDef

  // -------------------------------------------------------------------------
  // --- Action stuff --------------------------------------------------------
  // -------------------------------------------------------------------------

  ActionDef: (r) => withParens(
    P.seq(
      word(":action"),
      token(r.ActionFunctor),
      word(":parameters"),
      withParens(typedListOf(r.Variable)),
      r.ActionDefBody
    )),

  ActionFunctor: (r) => r.Name,

  ActionDefBody: (r) => P.seq(
    opt(P.seq(
      word(":vars"),
      withParens(typedListOf(r.Variable))
    )),
    // TODO: :precondition
    // TODO: :expansion
    // TODO: :maintain
    // TODO: :effect
    // TODO: :only-in-expansions
  ),

  // Spec reference: McDermott 1998, page 7
  Name: () => P.regexp(/[a-zA-Z][a-zA-Z0-9-_]*/).desc("name"),

  // booleans are referenced in the spec but are not explained
  Boolean: () => P.alt(P.string("true"), P.string("false")).map(Boolean),

  File: (r) => P.optWhitespace.then(r.Domain.many()),

});

module.exports = {
  parse: function(text) {
    let ast = PDDL.File.tryParse(text);
    return ast;
  }
};
