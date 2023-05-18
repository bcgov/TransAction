"use strict";
const { OpenShiftClientX } = require("@bcgov/pipeline-cli");
const path = require("path");

const KeyCloakClient = require("./keycloak");

module.exports = (settings) => {
  const phases = settings.phases;
  const options = settings.options;
  const phase = options.env;
  const changeId = phases[phase].changeId;
  const oc = new OpenShiftClientX(
    Object.assign({ namespace: phases[phase].namespace }, options)
  );

  const templatesLocalBaseUrl = oc.toFileUrl(
    path.resolve(__dirname, "../../openshift")
  );
  var objects = [];

  //Comment out this code to bypass keycloak part while deploying image
  //const kc = new KeyCloakClient(settings, oc);
  //kc.addUris();

  // The deployment of your cool app goes here  ▼▼▼
  objects.push(
    ...oc.processDeploymentTemplate(
      `${templatesLocalBaseUrl}/client-deploy-config.yaml`,
      {
        param: {
          NAME: `${phases[phase].name}-client`,
          SUFFIX: phases[phase].suffix,
          VERSION: phases[phase].tag,
          ENV: phases[phase].phase,
          HOST: phases[phase].host,
          CPU_REQUEST: phases[phase].resources.client.cpu.request,
          CPU_LIMIT: phases[phase].resources.client.cpu.limit,
          MEMORY_REQUEST: phases[phase].resources.client.memory.request,
          MEMORY_LIMIT: phases[phase].resources.client.memory.limit,
        },
      }
    )
  );

  objects.push(
    ...oc.processDeploymentTemplate(
      `${templatesLocalBaseUrl}/configmaps/api-appsettings.yaml`,
      {
        param: {
          ENV: phases[phase].phase,
        },
      }
    )
  );

  objects.push(
    ...oc.processDeploymentTemplate(
      `${templatesLocalBaseUrl}/api-deploy-config.yaml`,
      {
        param: {
          NAME: `${phases[phase].name}-api`,
          SUFFIX: phases[phase].suffix,
          VERSION: phases[phase].tag,
          HOST: phases[phase].host,
          ASPNETCORE_ENVIRONMENT: phases[phase].dotnet_env,
          CPU_REQUEST: phases[phase].resources.api.cpu.request,
          CPU_LIMIT: phases[phase].resources.api.cpu.limit,
          MEMORY_REQUEST: phases[phase].resources.api.memory.request,
          MEMORY_LIMIT: phases[phase].resources.api.memory.limit,
          ENV: phases[phase].phase,
        },
      }
    )
  );

  oc.applyRecommendedLabels(
    objects,
    phases[phase].name,
    phase,
    `${changeId}`,
    phases[phase].instance
  );
  oc.importImageStreams(
    objects,
    phases[phase].tag,
    phases.build.namespace,
    phases.build.tag
  );
  oc.applyAndDeploy(objects, phases[phase].instance);
};
