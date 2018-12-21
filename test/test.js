var assert = require("assert");
var parser = require("../src/parser.js");

describe("Parser", function() {
  
  describe("Domain definitions", function() {
    
    it("should be able to handle multiple domains in a single file", function() {
      let text = `(define (domain gripper))
      (define (domain other-gripper))
      `;
      let ast = parser.parse(text);
      assert.equal(2, ast.length);
    });

    it("should ignore whitespace in domain definitions", function() {
      let text = `(    define   (
        domain
              wacky-whitespace)  )
      `;
      let ast = parser.parse(text);
      assert.equal(1, ast.length);
      assert.equal("wacky-whitespace", ast[0][1]);
    });

    describe("Extension definitions", function() {

      it("can handle more than one extension", function() {
        let text = `
        (define (domain test)
          (:extends bleep bloop))
        `;
        let ast = parser.parse(text);
        let extendsBit = ast[0][2][0][1];
        assert.equal(JSON.stringify(["bleep", "bloop"]), JSON.stringify(extendsBit));
      });

      it("still handles one extension correctly", function() {
        let text = "(define (domain test) (:extends beep))";
        let ast = parser.parse(text);
        let extendsBit = ast[0][2][0][1];
        assert.equal(JSON.stringify(["beep"]), JSON.stringify(extendsBit));
      });

    });

  });

  it("can handle files starting with whitespace", function() {
    let text = `   
    (define (domain test))
    `;
    let ast = parser.parse(text);
  });

});
