/*global module, require */

/**
 * Part of the script to duplicate a Space in the Contentful CMS.
 *
 * This script processes the source:
 *  - create the client
 *  - get the Space (should exist, and contain all the Content Types to be transferred)
 *  - get a list of the Content Types
 *  - call the onComplete() method with the Content Types retrieved
 */

var contentfulManagement = require('contentful-management'),
    data = {};

function execute(log, config, onComplete) {
    data.log = log;
    data.config = config;
    data.onComplete = onComplete;

    createClient();
    getSpace();
}

function createClient() {
    data.client = contentfulManagement.createClient({
        accessToken: data.config.accessToken,
        host: data.config.host,
        secure: data.config.secure
    });

    data.log('Source client:', data.client);
}

function getSpace() {
    data.client.getSpace(data.config.spaceId).then(
        handleSpace,
        function () {
            data.log('Client getSpace ERROR:', arguments);
        }
    );
}

function handleSpace(space) {
    data.log('Source getSpace OK:', space.name);

    data.space = space;

    space.getContentTypes().then(
        handleContentTypes,
        function () {
            data.log('Source getContentTypes ERROR:', arguments);
        }
    )
}

function handleContentTypes(contentTypes) {
    data.log('Source getContentTypes OK:', contentTypes.length);

    data.onComplete(contentTypes);
}

module.exports = execute;

/* EOF */