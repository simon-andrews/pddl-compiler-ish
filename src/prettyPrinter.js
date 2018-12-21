"use strict";

var util = require("util");

let opts = {
  depth: null,
  colors: "auto"
};

module.exports = {
  prettyPrint: function(x) {
    let s = util.inspect(x, opts);
    console.log(s);
  }
};
