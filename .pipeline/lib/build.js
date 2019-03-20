"use strict";

const { OpenShiftClientX } = require("pipeline-cli");
const path = require("path");

<<<<<<< HEAD
module.exports = settings => {
  const phase = "build";
  let objects = [];
  const oc = new OpenShiftClientX({
    namespace: settings.phases[phase].namespace
  });
  const templatesLocalBaseUrl = oc.toFileUrl(
    path.resolve(__dirname, "../../openshift")
  );

  objects = objects.concat(
    oc.processDeploymentTemplate(
      `${templatesLocalBaseUrl}/client-build-config.yaml`,
      {
        param: {
          NAME: `${settings.phases[phase].name}-client`,
          SUFFIX: settings.phases[phase].suffix,
          VERSION: settings.phases[phase].tag,
          SOURCE_REPOSITORY_URL: `${oc.git.uri}`,
          SOURCE_REPOSITORY_REF: `${oc.git.branch_ref}`
        }
      }
    )
  );

  objects = objects.concat(
    oc.processDeploymentTemplate(
      `${templatesLocalBaseUrl}/api-build-config.yaml`,
      {
        param: {
          NAME: `${settings.phases[phase].name}-api`,
          SUFFIX: settings.phases[phase].suffix,
          VERSION: settings.phases[phase].tag,
          SOURCE_REPOSITORY_URL: `${oc.git.uri}`,
          SOURCE_REPOSITORY_REF: `${oc.git.branch_ref}`
        }
      }
    )
  );
=======
module.exports = (settings) => {
  const phase = 'build';
  let objects = [];
  const oc = new OpenShiftClientX({ namespace: settings.phases[phase].namespace });
  const templatesLocalBaseUrl = oc.toFileUrl(path.resolve(__dirname, '../../openshift'))

  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/client-build-config.yaml`, {
    param: {
      NAME: `${settings.phases[phase].name}-client`,
      SUFFIX: settings.phases[phase].suffix,
      VERSION: settings.phases[phase].tag,
      SOURCE_REPOSITORY_URL: `${oc.git.uri}`,
      SOURCE_REPOSITORY_REF: `${oc.git.branch_ref}`,
    },
  }))

  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/api-build-config.yaml`, {
    param: {
      NAME: `${settings.phases[phase].name}-api`,
      SUFFIX: settings.phases[phase].suffix,
      VERSION: settings.phases[phase].tag,
      SOURCE_REPOSITORY_URL: `${oc.git.uri}`,
      SOURCE_REPOSITORY_REF: `${oc.git.branch_ref}`,
    },
  }))
>>>>>>> Updated build and deploy configs to build/deploy all

  oc.applyRecommendedLabels(
    objects,
    settings.phases[phase].name,
    "build",
    settings.phases[phase].changeId
  );
  oc.applyAndBuild(objects);
};
