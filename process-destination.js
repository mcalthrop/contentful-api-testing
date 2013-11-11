/*global module, require */

/**
 * Part of the script to duplicate a Space in the Contentful CMS.
 *
 * This script processes the destination:
 *  - create the client
 *  - get the Space (should exist, and be empty)
 *  - create each of the Content Types that we have been passed in
 *  - call the onComplete() method
 */

var contentfulManagement = require('contentful-management'),
    data = {};

function execute(log, config, contentTypes, onComplete) {
    data.log = log;
    data.config = config;
    data.contentTypes = contentTypes;
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

    data.log('Destination client:', data.client);
}

function getSpace(onFulfilled) {
    data.client.getSpace(data.config.spaceId).then(
        onFulfilled,
        function () {
            data.log('Destination getSpace ERROR:', arguments);
        }
    );
}

function handleSpace(space) {
    var contentTypes = data.contentTypes;

    data.space = space;

    data.log('Destination getSpace OK:', space.name);
    data.log('Destination Content Types:', contentTypes.length);

    for (var i = 0, len = contentTypes.length; i < len; i++) {
        var srcContentType = contentTypes[i],
            destContentType = {
                sys: {id: srcContentType.sys.id},
                fields: srcContentType.fields,
                name: srcContentType.name,
                description: srcContentType.description,
                displayField: srcContentType.displayField
            };

        data.log('Creating content type:', i, destContentType.name);

        data.space.createContentType(destContentType).then(
            handleContentTypeCreated,
            function (error) {
                data.log('Destination createContentType ' + destContentType.name + ' ERROR:', error);
            }
        );
    }

    data.onComplete();
}

function handleContentTypeCreated(contentType) {
    data.log('Destination content type created OK:', contentType.name);

    data.space.publishContentType(contentType).then(
        handleContentTypePublished,
        function (error) {
            data.log('Destination publishContentType ' + contentType.name + ' ERROR:', error);
        }
    )
}

function handleContentTypePublished(contentType) {
    data.log('Destination content type published OK:', contentType.name);
}

module.exports = execute;

/* EOF */