"use strict";
const { OpenShiftClientX } = require("pipeline-cli");

module.exports = settings => {
  const phases = settings.phases;
  const options = settings.options;
  const oc = new OpenShiftClientX({
    namespace: phases.build.namespace,
    ...options
  });
  const target_phase = options.phase;

  for (var k in phases) {
    if (phases.hasOwnProperty(k) && k != "prod") {
      const phase = phases[k];
      if (k == target_phase) {
        oc.raw("delete", ["all"], {
          selector: `app-name=${phase.name},env-id=${
            phase.changeId
          },env-name!=prod,!shared,github-repo=${
            oc.git.repository
          },github-owner=${oc.git.owner}`,
          namespace: phase.namespace
        });
        oc.raw(
          "delete",
          [
            "pvc,Secret,configmap,endpoints,RoleBinding,role,ServiceAccount,Endpoints"
          ],
          {
            selector: `app-name=${phase.name},env-id=${
              phase.changeId
            },env-name!=prod,!shared,github-repo=${
              oc.git.repository
            },github-owner=${oc.git.owner}`,
            namespace: phase.namespace
          }
        );
      }
    }
  }
};
