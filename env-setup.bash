# ------------------------------------------------------------------------------------------
#
# Sample script for setting up the environment before running api-testing.js.
#
# Usage:
#   Change the environment variables in this file to correct values, then run:
#    . env-setup.bash
#
# ------------------------------------------------------------------------------------------

export SRC_CONTENTFUL_MANAGEMENT_HOSTNAME=cdn.contentful.com
export SRC_CONTENTFUL_SECURE=true
export SRC_CONTENTFUL_SPACE_ID=
export SRC_CONTENTFUL_ACCESS_TOKEN=

export DEST_CONTENTFUL_MANAGEMENT_HOSTNAME=api.contentful.com
export DEST_CONTENTFUL_SECURE=true
export DEST_CONTENTFUL_SPACE_ID=
export DEST_CONTENTFUL_ACCESS_TOKEN=

# EOF