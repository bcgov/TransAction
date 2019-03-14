'use strict';

const { OpenShiftClientX } = require('pipeline-cli');
const path = require('path');

module.exports = (settings) => {
  const phase = 'build';
  const oc = new OpenShiftClientX({ namespace: settings.phases[phase].namespace });
  const templateFile = path.resolve(__dirname, '../../openshift/bc.yaml');

  const objects = oc.processBuidTemplate(oc.toFileUrl(templateFile), {
    param: {
      NAME: settings.phases[phase].name,
      SUFFIX: settings.phases[phase].suffix,
      VERSION: settings.phases[phase].tag,
      SOURCE_REPOSITORY_URL: `${oc.git.uri}`,
      SOURCE_REPOSITORY_REF: `${oc.git.branch_ref}`,
    },
  });

  oc.applyRecommendedLabels(objects, settings.phases[phase].name, 'build', settings.phases[phase].changeId);
  oc.applyAndBuild(objects);
};
