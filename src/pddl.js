var assert = require("assert");
var parser = require("./parser.js");

class Action {
  constructor(data) {

    // Action name and parameters are mandatory, and position is fixed
    assert.equal(data[0], ":action");
    this.name = data[1];
    assert.equal(data[2], ":parameters");
    this.parameters = data[3];

    // and now, action body (separate for some reason in spec)
    let actionBody = data[4];
    for (var i = 0; i < actionBody.length; i++) {
      switch (actionBody[i][0]) {
        case ":precondition":
          this.precondition = actionBody[i][1]; break;
        case ":effect":
          this.effect = actionBody[i][1]; break;
      }
    }
  }
}

class Domain {
  constructor(data) {
    assert.equal(data[0], "domain");
    this.name = data[1];
    this.predicates = data[2];
    this.actions = data[3];
  }
}

// "Object" is already taken by JavaScript
class Obj3ct {
  constructor(data) {
    this.name = data;
  }
}

class Predicate {
  constructor(data) {
    this.name = data[0];
    this.variables = [];
    for (var i = 0; i < data[1].length; i++) {
      this.variables.push(data[1][i]);
    }
  }
}

class Problem {
  constructor(data) {
    assert.equal(data[0], "problem");
    this.name = data[1];
    assert.equal(data[2], ":domain");
    this.domainName = data[3];
    this.objects = data[4];
    this.init = data[5];
    this.goal = data[6];
  }
}

class Variable {
  constructor(data) {
    this.name = data;
  }
}

class LogicOp {
  constructor(predicates) {
    if (this.constructor == LogicOp) {
      throw new Error("LogicOp can't be instantiated directly");
    }
    this.predicates = predicates;
  }
}

class And extends LogicOp {}
class Not extends LogicOp {}
class Or  extends LogicOp {}

module.exports = {
  Action: Action,
  And: And,
  Domain: Domain,
  Not: Not,
  Obj3ct: Obj3ct,
  Or: Or,
  Predicate: Predicate,
  Problem: Problem,
  Variable: Variable,
  makeLogic: (data) => {
    let r = data[0];
    let p = data[1];
    switch (r) {
      case "and": return new And(p);
      case "not": return new Not(p);
      case "or":  return new Or(p);
    }
  }
}
