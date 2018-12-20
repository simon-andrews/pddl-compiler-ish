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
      r.Number,
      r.List,
    );
  },

  Expression: function(r) {
    return P.alt(
      r.Name,
      r.Number,
      r.List,
    );
  },

  // Spec reference: McDermott 1998, page 7
  Name: function() {
    return P.regexp(/[a-zA-Z:\?][a-zA-Z0-9-_]*/)
      .desc("name");
  },

  Number: function() {
    return P.regexp(/[0-9]+/)
      .map(Number)
      .desc("number");
  },

  File: function(r) {
    return r.List.many();
  },

});

function prettyPrint(x) {
  let opts = { depth: null, colors: "auto" };
  let s = util.inspect(x, opts);
  console.log(s);
}

let pddlText = `\
(define (domain gripper)
  (:predicates (room ?r)
               (ball ?b)
               (gripper ?g)
               (at-robby ?r)
               (at ?b ?r)
               (free ?g)
               (carry ?o ?g))
  (:action move
   :parameters (?from ?to)
   :precondition (and (room ?from)
                      (room ?to)
                      (at-robby ?from))
   :effect (and (at-robby ?to)
                (not (at-robby ?from)))))
`;

let ast = PDDL.File.tryParse(pddlText);
prettyPrint(ast);
