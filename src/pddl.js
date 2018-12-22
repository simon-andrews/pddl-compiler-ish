var assert = require("assert");
var parser = require("./parser.js");

class Domain {
  constructor(data) {
    assert.equal(data[0], "domain");
    this.name = data[1];
  }
}

class PddlFile {
  constructor(text) {
    this.domains = [];
    let ast = parser.parse(text);
    for (var i = 0; i < ast.length; i++) {
      if (ast[i][0] === "domain") {
        this.domains.push(new Domain(ast[i]));
      }
    }
  }
}

module.exports = {
  Domain: Domain,
  PddlFile: PddlFile,
}
