"use strict";

let P = require("parsimmon");
let util = require("util");

let PDDL = P.createLanguage({

  Expression: function(r) {
    return P.alt(r.Symbol, r.Number, r.List);
  },

  Symbol: function() {
    return P.regexp(/[a-zA-Z:\?_-][a-zA-Z_-]*/)
      .desc("symbol");
  },

  Number: function() {
    return P.regexp(/[0-9]+/)
      .map(Number)
      .desc("number");
  },

  List: function(r) {
    return r.Expression
      .trim(P.optWhitespace)
      .many()
      .wrap(P.string("("), P.string(")"));
  },

  File: function(r) {
    return r.Expression
      .trim(P.optWhitespace)
      .many();
  }

});

function prettyPrint(x) {
  let opts = { depth: null, colors: "auto" };
  let s = util.inspect(x, opts);
  console.log(s);
}

let text = `\
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

let ast = PDDL.File.tryParse(text);
prettyPrint(ast);
