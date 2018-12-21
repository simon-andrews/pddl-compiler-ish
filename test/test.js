var assert = require("assert");
var parser = require("../src/parser.js");

describe("Parser", function() {
  describe("Domains", function() {
    it("should be able to handle multiple domains in a single file", function() {
      let text = `(define (domain gripper))
      (define (domain other-gripper))
      `;
      let ast = parser.parse(text);
      assert.equal(2, ast.length);
    });
  });

  it("can handle files starting with whitespace", function() {
    let text = `   
    (define (domain test))
    `;
    let ast = parser.parse(text);
  });

});
