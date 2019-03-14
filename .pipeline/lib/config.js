"use strict";
const options = require("pipeline-cli").Util.parseArguments();
const changeId = options.pr; //aka pull-request
const version = "1.0.0";
const name = "transaction";

const phases = {
  build: {
    namespace: "vlpweg-tools",
    name: `${name}`,
    phase: "build",
    changeId: changeId,
    suffix: `-build-${changeId}`,
    instance: `${name}-build-${changeId}`,
    version: `${version}-${changeId}`,
    tag: `build-${version}-${changeId}`
  },
  dev: {
    namespace: "vlpweg-dev",
    name: `${name}`,
    phase: "dev",
    changeId: changeId,
    suffix: `-dev-${changeId}`,
    instance: `${name}-dev-${changeId}`,
    version: `${version}-${changeId}`,
    tag: `dev-${version}`,
    host: `transaction-${changeId}-vlpweg-dev.pathfinder.gov.bc.ca`,
    dotnet_env: "Development"
  },
  test: {
    namespace: "vlpweg-test",
    name: `${name}`,
    phase: "test",
    changeId: changeId,
    suffix: "-test",
    instance: `${name}-test`,
    version: `${version}-${changeId}`,
    tag: `test-${version}`,
    host: `transaction-vlpweg-test.pathfinder.gov.bc.ca`,
    dotnet_env: "Production"
  },
  prod: {
    namespace: "vlpweg-prod",
    name: `${name}`,
    phase: "prod",
    changeId: changeId,
    suffix: "-prod",
    instance: `${name}-prod`,
    version: `${version}-${changeId}`,
    tag: `prod-${version}`,
    host: "transaction-vlpweg-prod.pathfinder.gov.bc.ca",
    dotnet_env: "Production"
  }
};

module.exports = exports = phases;
