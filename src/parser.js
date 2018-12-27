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

        //opt(r.ExtensionDef),
        //opt(r.ConstantsDef),
        opt(r.PredicatesDef),
        opt(r.ActionDef.many())
      )))
      .map((x) => new pddl.Domain(x)),

  /*
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
  */

  PredicatesDef: (r) => withParens(word(":predicates").then(typedListOf(r.AtomicFormulaSkeleton))),

  AtomicFormulaSkeleton: (r) => withParens(
    P.seq(
      r.Name.skip(P.optWhitespace),
      typedListOf(P.alt(r.Variable, r.Name))
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
    )).map((x) => new pddl.Action(x)),

  ActionFunctor: (r) => r.Name,

  ActionDefBody: (r) => P.seq(
    /*opt(P.seq(
      word(":vars"),
      withParens(typedListOf(r.Variable))
    ))*/
    opt(P.seq(
      word(":precondition"),
      r.GoalDescription,
    )),
    opt(P.seq(
      word(":effect"),
      r.GoalDescription,
    )),
    // TODO: :expansion
    // TODO: :maintain
    // TODO: :only-in-expansions
  ),

  Problem: (r) => withParens(
    word("define")
    .then(r.lparen)
    .then(P.seq(
      word("problem"),
      r.Name.skip(r.rparen).skip(r.lparen),
      word(":domain"),
      r.Name.skip(r.rparen),

      opt(r.ObjectDef),
      opt(r.InitDef),
      opt(r.GoalDef),
    ))).map((x) => new pddl.Problem(x)),

  ObjectDef: (r) => withParens(
    word(":objects")
    .then(typedListOf(r.Object))),

  Object: (r) => r.Name.map((x) => new pddl.Obj3ct(x)),

  InitDef: (r) => withParens(word(":init").then(typedListOf(r.AtomicFormulaSkeleton))),

  GoalDef: (r) => withParens(word(":goal").then(r.GoalDescription)),

  GoalDescription: (r) => P.alt(r.LogicOp, r.AtomicFormulaSkeleton),

  LogicOp: (r) => withParens(
    P.seq(
      P.alt(
        word("and"),
        word("or"),
        word("not")),
      typedListOf(r.GoalDescription)))
    .map(pddl.makeLogic),

  // Spec reference: McDermott 1998, page 7
  Name: () => P.regexp(/[a-zA-Z][a-zA-Z0-9-_]*/).desc("name"),

  // booleans are referenced in the spec but are not explained
  Boolean: () => P.alt(P.string("true"), P.string("false")).map(Boolean),

  File: (r) => P.optWhitespace.then(P.alt(r.Domain, r.Problem).many()),

});

module.exports = {
  parse: function(text) {
    let ast = PDDL.File.tryParse(text);
    return ast;
  }
};
