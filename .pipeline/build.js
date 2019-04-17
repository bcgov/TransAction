"use strict";

const build = require("./lib/build.js");
const settings = require("./lib/config.js");

build({ ...settings });
