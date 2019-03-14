'use strict';

const deploy = require('./lib/deploy.js');
const phases = require('./lib/config.js')
const options= require('pipeline-cli').Util.parseArguments()

deploy({phases:phases, phase: options.phase});
