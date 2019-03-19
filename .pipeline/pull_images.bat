oc import-image nodejs --from node:8.15.1-alpine --confirm
oc import-image nginx --from nginx:1.15.9-alpine --confirm
oc import-image nodejs-8-rhel7 --from=registry.access.redhat.com/rhscl/nodejs-8-rhel7:1-41 --confirm
oc import-image dotnet-22-rhel7 --from=registry.access.redhat.com/dotnet/dotnet-22-rhel7:2.2-6 --confirm