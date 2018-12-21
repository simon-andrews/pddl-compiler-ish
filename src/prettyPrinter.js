"use strict";

var util = require("util");

const opts = {
  depth: null, // disable recursion depth limit, recurse through the AST indefinitely
  colors: true // style output with ANSI color codes
};

module.exports = {
  prettyPrint: function(x) {
    let s = util.inspect(x, opts);
    console.log(s);
  }
};
