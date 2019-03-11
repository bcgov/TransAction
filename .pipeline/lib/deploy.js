'use strict';

const { OpenShiftClientX } = require('pipeline-cli');
const path = require('path');

module.exports = () => {
  const oc = new OpenShiftClientX();
  oc.globalArgs.namespace = `devhub-${oc.options.env}`;
  const templateFile = path.resolve(__dirname, '../../openshift/dc.yaml');
  const appName = 'dotnet-mvc';
  const buildNamespace = 'devhub-tools';
  const buildVersion = `build-v${oc.options.pr}`;
  const deploymentVersion = `${oc.options.env}-1.0.0`;
  // remove pr in prefix for test and prod environemnt:
  const projectPrefix =
    oc.options.env === 'dev' ? `-${oc.options.env}-${oc.options.pr}` : `-${oc.options.env}`;

  const objects = oc.process(oc.toFileUrl(templateFile), {
    param: {
      ...{
        NAME: appName,
        SUFFIX: projectPrefix,
        VERSION: `${deploymentVersion}`,
      }
    },
  });

  oc.applyBestPractices(objects);
  oc.applyRecommendedLabels(objects, appName, oc.options.env, oc.options.pr);
  oc.fetchSecretsAndConfigMaps(objects);
  oc.importImageStreams(objects, deploymentVersion, buildNamespace, buildVersion);
  oc.applyAndDeploy(objects, `${appName}${projectPrefix}`);
};
