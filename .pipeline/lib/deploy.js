"use strict";

const { OpenShiftClientX } = require("pipeline-cli");
const path = require("path");

module.exports = settings => {
  const phase = settings.phase;
  const phases = settings.phases;

  const oc = new OpenShiftClientX({ namespace: phases[phase].namespace });
  const templatesLocalBaseUrl = oc.toFileUrl(
    path.resolve(__dirname, "../../openshift")
  );
  //const templateFile = path.resolve(__dirname, '../../openshift/client-deploy-config.yaml');

  let objects = [];

  objects = objects.concat(
    oc.processDeploymentTemplate(
      `${templatesLocalBaseUrl}/client-deploy-config.yaml`,
      {
        param: {
          NAME: `${phases[phase].name}-client`,
          SUFFIX: phases[phase].suffix,
          VERSION: phases[phase].tag,
          ASPNETCORE_ENVIRONMENT: phases[phase].dotnet_env
        }
      }
    )
  );

  objects = objects.concat(
    oc.processDeploymentTemplate(
      `${templatesLocalBaseUrl}/api-deploy-config.yaml`,
      {
        param: {
          NAME: `${phases[phase].name}-api`,
          SUFFIX: phases[phase].suffix,
          VERSION: phases[phase].tag,
          ASPNETCORE_ENVIRONMENT: phases[phase].dotnet_env
        }
      }
    )
  );

  oc.applyRecommendedLabels(
    objects,
    phases[phase].name,
    phase,
    phases[phase].changeId
  );
  oc.fetchSecretsAndConfigMaps(objects);
  oc.importImageStreams(
    objects,
    phases[phase].tag,
    phases.build.namespace,
    phases.build.tag
  );
  oc.applyAndDeploy(objects, phases[phase].instance);
};
