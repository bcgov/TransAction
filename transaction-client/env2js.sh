#!/bin/bash

if [ ! -z ${REACT_APP_SSO_HOST} ]; then
 cat <<END
 window.RUNTIME_REACT_APP_SSO_HOST='${REACT_APP_SSO_HOST}';
END
fi

if [ ! -z ${REACT_APP_SSO_REALM} ]; then
 cat <<END
 window.RUNTIME_REACT_APP_SSO_REALM='${REACT_APP_SSO_REALM}';
END
fi

if [ ! -z ${REACT_APP_SSO_CLIENT} ]; then
 cat <<END
 window.RUNTIME_REACT_APP_SSO_CLIENT='${REACT_APP_SSO_CLIENT}';
END
fi

if [ ! -z ${REACT_APP_API_HOST} ]; then
 cat <<END
 window.RUNTIME_REACT_APP_API_HOST='${REACT_APP_API_HOST}';
END
fi