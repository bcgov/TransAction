"use strict";
const options = require("@bcgov/pipeline-cli").Util.parseArguments();
const changeId = options.pr; // aka pull-request
const version = "2.3.9";
const name = "transaction";

Object.assign(options.git, { owner: "ychung-mot", repository: "TransAction" });
const phases = {
  build: {
    namespace: "55b94d-tools",
    name: `${name}`,
    phase: "build",
    changeId: changeId,
    suffix: `-build-${changeId}`,
    instance: `${name}-build-${changeId}`,
    version: `${version}-${changeId}`,
    tag: `build-${version}-${changeId}`,
    transient: true,
  },
  dev: {
    namespace: "55b94d-dev",
    name: `${name}`,
    phase: "dev",
    changeId: changeId,
    suffix: `-dev-${changeId}`,
    instance: `${name}-dev-${changeId}`,
    version: `${version}-${changeId}`,
    tag: `dev-${version}-${changeId}`,
    host: `transaction-55b94d-dev.apps.silver.devops.gov.bc.ca`,
    dotnet_env: "Development",
    transient: true,
    resources: {
      api: {
        cpu: { request: "150m", limit: "200m" },
        memory: { request: "250M", limit: "500M" },
      },
      client: {
        cpu: { request: "50m", limit: "100m" },
        memory: { request: "50M", limit: "100M" },
      },
    },
  },
  test: {
    namespace: "55b94d-test",
    name: `${name}`,
    phase: "test",
    changeId: changeId,
    suffix: `-test`,
    instance: `${name}-test`,
    version: `${version}`,
    tag: `test-${version}`,
    host: `transaction-55b94d-test.apps.silver.devops.gov.bc.ca`,
    dotnet_env: "Test",
    resources: {
      api: {
        cpu: { request: "150m", limit: "200m" },
        memory: { request: "250M", limit: "500M" },
      },
      client: {
        cpu: { request: "50m", limit: "100m" },
        memory: { request: "50M", limit: "100M" },
      },
    },
  },
  prod: {
    namespace: "55b94d-prod",
    name: `${name}`,
    phase: "prod",
    changeId: changeId,
    suffix: `-prod`,
    instance: `${name}-prod`,
    version: `${version}`,
    tag: `prod-${version}`,
    host: "transaction-55b94d-prod.apps.silver.devops.gov.bc.ca",
    dotnet_env: "Production",
    resources: {
      api: {
        cpu: { request: "150m", limit: "200m" },
        memory: { request: "250M", limit: "500M" },
      },
      client: {
        cpu: { request: "50m", limit: "100m" },
        memory: { request: "50M", limit: "100M" },
      },
    },
  },
};

// This callback forces the node process to exit as failure.
process.on("unhandledRejection", (reason) => {
  console.log(reason);
  process.exit(1);
});

module.exports = exports = { phases, options };
