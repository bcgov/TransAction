'use strict';

const { OpenShiftClientX } = require('pipeline-cli');
const path = require('path');

module.exports = (settings) => {
  const phase = settings.phase;
  const phases = settings.phases;

  const oc = new OpenShiftClientX({ namespace: phases[phase].namespace });

  const templateFile = path.resolve(__dirname, '../../openshift/api-deploy-config.yaml');

  const objects = []
  
  objects.push(...oc.processDeploymentTemplate(oc.toFileUrl(templateFile), {
    param: {
        NAME: phases[phase].name,
        SUFFIX: phases[phase].suffix,
        VERSION: phases[phase].tag,
        ASPNETCORE_ENVIRONMENT: phases[phase].dotnet_env
    },
  }));

  oc.applyRecommendedLabels(objects, phases[phase].name, phase, phases[phase].changeId);
  oc.fetchSecretsAndConfigMaps(objects);
  oc.importImageStreams(objects, phases[phase].tag, phases.build.namespace, phases.build.tag);
  oc.applyAndDeploy(objects, phases[phase].instance);
};
