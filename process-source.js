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
    getSpace(handleSpace);
}

function createClient() {
    data.client = contentfulManagement.createClient({
        accessToken: data.config.accessToken,
        host: data.config.host,
        secure: data.config.secure
    });

    data.log('Source client:', data.client);
}

function getSpace(onFulfilled) {
    data.client.getSpace(data.config.spaceId).then(
        onFulfilled,
        function (error) {
            data.log('Client getSpace ERROR:', error);
        }
    );
}

function handleSpace(space) {
    data.log('Source getSpace OK:', space.name);

    data.space = space;

    space.getContentTypes().then(
        handleContentTypes,
        function (error) {
            data.log('Source getContentTypes ERROR:', error);
        }
    );
}

function handleContentTypes(contentTypes) {
    data.log('Source getContentTypes OK:', contentTypes.length);

    data.contentTypes = contentTypes;

    data.space.getEntries().then(
        handleEntries,
        function (error) {
            data.log('Source getEntries ERROR:', error);
        }
    );
}

function handleEntries(entries) {
    data.log('Source getContentTypes OK:', entries.length);

    data.onComplete(data.contentTypes, entries);
}

module.exports = execute;

/* EOF */