"use strict";

const deploy = require("./lib/deploy.js");
const settings = require("./lib/config.js");

deploy({ ...settings });
