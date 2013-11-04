#!/bin/bash

# Sample URL:
# http://cdn.contentful.com/spaces/e2h9ve8r21wy/entries?access_token=5e4de9569f077ad4c4f8eda84305d3ae73284adc0e15a8df2fe7151f0fe318ba

PROTOCOL=http
API_HOST=cdn.contentful.com

SRC_ACCESS_TOKEN=5e4de9569f077ad4c4f8eda84305d3ae73284adc0e15a8df2fe7151f0fe318ba
SRC_SPACE_ID=e2h9ve8r21wy
SRC_BASE_URL=${PROTOCOL}://$API_HOST/spaces/${SRC_SPACE_ID}/
SRC_SPACE_URL=${PROTOCOL}://$API_HOST/spaces/${SRC_SPACE_ID}/?access_token=$SRC_ACCESS_TOKEN
SRC_ENTRIES_URL=${PROTOCOL}://$API_HOST/spaces/${SRC_SPACE_ID}/entries?access_token=$SRC_ACCESS_TOKEN
SRC_CONTENT_TYPES_URL=${PROTOCOL}://$API_HOST/spaces/${SRC_SPACE_ID}/content_types?access_token=$SRC_ACCESS_TOKEN

set -x
curl $SRC_SPACE_URL
curl $SRC_ENTRIES_URL
curl $SRC_CONTENT_TYPES_URL

# EOF