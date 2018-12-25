var assert = require("assert");
var parser = require("./parser.js");

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

module.exports = {
  Domain: Domain,
  Predicate: Predicate,
  makePredicate: (data) => new Predicate(data),
}
