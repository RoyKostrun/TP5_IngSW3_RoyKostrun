#!/bin/sh
set -eu
envsubst '${API_BASE_URL}' \
  </etc/nginx/templates/default.conf.template \
  >/etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
