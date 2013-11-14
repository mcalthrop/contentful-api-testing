# ------------------------------------------------------------------------------------------
#
# Sample script for setting up the environment before running api-testing.js.
#
# Usage:
#   Change the environment variables in this file to correct values, then run:
#    . env-setup.bash
#
# Note:
#   It is advisable to use the API Management host as the source host because doing
#   so means that entries retrieved from the source host will contain complete
#   localisation data - the retrieval host returns flattened data entries,
#   containing no localisation data, which causes the call to createEntry() to fail.
#
# ------------------------------------------------------------------------------------------

export SRC_CONTENTFUL_MANAGEMENT_HOSTNAME=api.contentful.com
export SRC_CONTENTFUL_SECURE=true
export SRC_CONTENTFUL_SPACE_ID=
export SRC_CONTENTFUL_ACCESS_TOKEN=

export DEST_CONTENTFUL_MANAGEMENT_HOSTNAME=$SRC_CONTENTFUL_MANAGEMENT_HOSTNAME
export DEST_CONTENTFUL_SECURE=true
export DEST_CONTENTFUL_SPACE_ID=
export DEST_CONTENTFUL_ACCESS_TOKEN=$SRC_CONTENTFUL_ACCESS_TOKEN

# EOF