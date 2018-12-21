"use strict";

var fs = require("fs");
var parser = require("./src/parser.js");
var pp = require("./src/prettyPrinter.js");

fs.readFile(process.argv[2], "utf8", function (err, data) {
  if (err) {
    return console.log(err);
  }
  let ast = parser.parse(data);
  pp.prettyPrint(ast);
});
