var assert = require("assert");
var parser = require("./parser.js");

class Action {
  constructor(data) {
    console.log(data);

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
          this.precondition = actionBody[i][1]; i++; break;
        case ":effect":
          this.effect = actionBody[i][1]; i++; break;
      }
    }
  }
}

class Domain {
  constructor(data) {
    assert.equal(data[0], "domain");
    this.name = data[1];
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

class Variable {
  constructor(data) {
    this.name = data;
  }
}

module.exports = {
  Action: Action,
  Domain: Domain,
  Predicate: Predicate,
  Variable: Variable,
}
