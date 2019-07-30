"use strict";
const options = require("pipeline-cli").Util.parseArguments();
const changeId = options.pr; //aka pull-request
const version = "2.1.0";
const name = "transaction";

//  prettier-ignore
const phases = {
  build: {namespace: 'vlpweg-tools'  , name: `${name}`, phase: 'build', changeId:changeId, suffix: `-build-${changeId}`, instance: `${name}-build-${changeId}`, version:`${version}-${changeId}`, tag:`build-${version}-${changeId}`},
    dev: {namespace: 'vlpweg-dev'    , name: `${name}`, phase: 'dev'  , changeId:changeId, suffix: `-dev-${changeId}`  , instance: `${name}-dev-${changeId}`  , version:`${version}-${changeId}`, tag:`dev-${version}-${changeId}`   , host: `transaction-${changeId}-vlpweg-dev.pathfinder.gov.bc.ca`, dotnet_env: 'Development'},
   test: {namespace: 'vlpweg-test'   , name: `${name}`, phase: 'test' , changeId:changeId, suffix: '-test'             , instance: `${name}-test`             , version:`${version}-${changeId}`, tag:`test-${version}`              , host: `transaction-vlpweg-test.pathfinder.gov.bc.ca`,            dotnet_env: 'Production'},
   prod: {namespace: 'vlpweg-prod'   , name: `${name}`, phase: 'prod' , changeId:changeId, suffix: '-prod'             , instance: `${name}-prod`             , version:`${version}-${changeId}`, tag:`prod-${version}`              , host: 'transaction-vlpweg-prod.pathfinder.gov.bc.ca',            dotnet_env: 'Production'}
}

// This callback forces the node process to exit as failure.
process.on("unhandledRejection", reason => {
  console.log(reason);
  process.exit(1);
});

module.exports = exports = { phases, options };
