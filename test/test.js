var assert = require("assert");
var fs = require("fs");
var parser = require("../src/parser.js");

let sampleAst = null;
fs.readFile("./test.pddl", "utf8", (err, text) => {
  if (err) { throw new Error("couldn't find test PDDL file"); }
  sampleAst = parser.parse(text);
})

describe("Parser", function() {

  describe("Domain definitions", function() {

    it("sets name correctly", function() {
      assert.equal("gripper", sampleAst[0].name);
    });

    it("can handle multiple domains in a single file", function() {
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

  it("can handle wild whitespace use", function() {
    let text = `(    define   (
      domain
            wacky-whitespace)  )
    `;
    let ast = parser.parse(text);
    assert.equal(1, ast.length);
    assert.equal("wacky-whitespace", ast[0].name);
  });
});
