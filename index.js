"use strict";

var fs = require("fs");
var parser = require("./src/parser.js");
var pddl = require("./src/pddl.js");
var pp = require("./src/prettyPrinter.js");

fs.readFile(process.argv[2], "utf8", function (err, text) {
  if (err) {
    return console.log(err);
  }
  let ast = parser.parse(text);
  pp.prettyPrint(ast);
});
