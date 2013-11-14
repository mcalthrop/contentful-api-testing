/*global module, require */

/**
 * Part of the script to duplicate a Space in the Contentful CMS.
 *
 * This script processes the destination:
 *  - create the client
 *  - get the Space (should exist, and be empty)
 *  - for each Content Type passed in:
 *    - check if it exists:
 *      - if so, publish
 *      - if not, create, then publish it
 *      - for each Entry that has this Content Type:
 *        - check if the Entry exists
 *          - if so, publish it
 *          - if not, create, then publish it
 *  - call the onComplete() method
 */

var contentfulManagement = require('contentful-management'),
    data = {};

function execute(log, config, contentTypes, entries, onComplete) {
    data.log = log;
    data.config = config;
    data.entries = entries;
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
                sys: {
                    id: srcContentType.sys.id
                },
                fields: srcContentType.fields,
                name: srcContentType.name,
                description: srcContentType.description,
                displayField: srcContentType.displayField
            };

        getContentType(destContentType);
    }

    data.onComplete();
}

function getContentType(contentType) {
    var contentTypeId = contentType.sys.id,
        contentTypeName = contentType.name;

    data.log('Destination get Content Type:', contentTypeId, contentTypeName);

    data.space.getContentType(contentTypeId).then(
        handleGetContentType,
        function (error) {
            // assume that the error is because the content type doesn't exist
            createContentType(contentType);
        }
    )
}

function handleGetContentType(contentType) {
    var contentTypeId = contentType.sys.id,
        contentTypeName = contentType.name;

    data.log('Destination Content Type already exists:', contentTypeId, contentTypeName);

    createEntries(contentType);
}

function createContentType(contentType) {
    var contentTypeId = contentType.sys.id,
        contentTypeName = contentType.name;

    data.log('Creating content type:', contentTypeId, contentTypeName);

    data.space.createContentType(contentType).then(
        handleCreateContentType,
        function (error) {
            data.log('Destination createContentType ' + contentTypeName + ' ERROR:', error);
        }
    );
}

function handleCreateContentType(contentType) {
    var contentTypeId = contentType.sys.id;

    data.log('Destination content type created OK:', contentTypeId, contentType.name);

    data.space.publishContentType(contentType).then(
        handlePublishContentType,
        function (error) {
            data.log('Destination publishContentType ' + contentType.name + ' ERROR:', error);
        }
    )
}

function handlePublishContentType(contentType) {
    var contentTypeId = contentType.sys.id;

    data.log('Destination content type published OK:', contentTypeId);

    createEntries(contentType);
}

function createEntries(contentType) {
    var entries = data.entries,
        createdDestContentTypeId = contentType.sys.id;

    data.log('Creating entries for content type:', createdDestContentTypeId, contentType.name);

    for (var i = 0, len = entries.length; i < len; i++) {
        var srcEntry = entries[i],
            srcContentTypeId = srcEntry.sys.contentType.sys.id;

        if (srcContentTypeId === createdDestContentTypeId) {
            var destEntry = {
                sys: {
                    id: srcEntry.sys.id
                },
                fields: srcEntry.fields
            };

            data.log('Source entry to duplicate:', srcContentTypeId, srcEntry.sys.id);

            getEntry(destEntry, createdDestContentTypeId);
        }
    }
}

// Note: we only need the second parameter for when the entry has not been found
function getEntry(entry, contentTypeId) {
    var entryId = entry.sys.id;

    data.log("Destination get Entry:", entryId);

    data.space.getEntry(entryId).then(
        handleGetEntry,
        function (error) {
            // Just assume that the error is that it has not been found
            createEntry(contentTypeId, entry);
        }
    )
}

function handleGetEntry(entry) {
    var entryId = entry.sys.id;

    data.log('Destination Entry already exists:', entryId);

    publishEntry(entry);
}

function createEntry(contentTypeId, entry) {
    var entryId = entry.sys.id;

    data.log("Creating destination entry:", contentTypeId, entryId);

    data.space.createEntry(contentTypeId, entry).then(
        handleCreateEntry,
        function (error) {
            data.log('Destination createEntry ' + contentTypeId + ' ' + entryId + ' ERROR:', error);
        }
    )
}

function handleCreateEntry(entry) {
    var entryId = entry.sys.id,
        contentTypeId = entry.sys.contentType.sys.id;

    data.log('Destination createEntry OK:', contentTypeId, entryId);

    publishEntry(entry);
}

function publishEntry(entry) {
    var entryId = entry.sys.id,
        contentTypeId = entry.sys.contentType.sys.id;

    data.log('Publishing entry:', contentTypeId, entryId);

    data.space.publishEntry(entry).then(
        handlePublishEntry,
        function (error) {
            data.log('Destination publishEntry ' + entryId + ' ERROR:', error);
        }
    )
}

function handlePublishEntry(entry) {
    var entryId = entry.sys.id,
        contentTypeId = entry.sys.contentType.sys.id;

    data.log('Destination publishEntry OK:', contentTypeId, entryId);
}

module.exports = execute;

/* EOF */