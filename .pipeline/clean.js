"use strict";

const settings = require("./lib/config.js");
const clean = require("./lib/clean.js");

clean({ ...settings });
