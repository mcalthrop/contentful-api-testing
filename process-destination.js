/*global module, require */

/**
 * Part of the script to duplicate a Space in the Contentful CMS.
 *
 * This script processes the destination:
 *  - create the client
 *  - get the Space (should exist, and be empty)
 *  - for each Content Type passed in:
 *    - create
 *    - publish
 *    - create related Entries
 *    - read related Entries
 *    - publish related Entries
 *  - call the onComplete() method
 */

var contentfulManagement = require('contentful-management'),
    data = {contentTypeMapping: {}};

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
                fields: srcContentType.fields,
                name: srcContentType.name,
                description: srcContentType.description,
                displayField: srcContentType.displayField
            };

        data.log('Creating content type:', destContentType.name);

        data.space.createContentType(destContentType).then(
            function (contentType) {
                var srcContentTypeId = srcContentType.sys.id,
                    destContentTypeId = contentType.sys.id;

                data.log('Destination content type created OK:', destContentTypeId, contentType.name, contentType.fields);
                data.log('Mapping dest to src content type id:', destContentTypeId, '<', srcContentTypeId);

                // store the content type id so it can be mapped later when creating entries
                data.contentTypeMapping[destContentTypeId] = srcContentTypeId;

                handleContentTypeCreated(contentType);
            },
            function (error) {
                data.log('Destination createContentType ' + destContentType.name + ' ERROR:', error);
            }
        );

        // TODO: remove once the bug below is fixed
        return;
    }

    data.onComplete();
}

function handleContentTypeCreated(contentType) {
    data.space.publishContentType(contentType).then(
        handleContentTypePublished,
        function (error) {
            data.log('Destination publishContentType ' + contentType.name + ' ERROR:', error);
        }
    )
}

function handleContentTypePublished(contentType) {
    data.log('Destination content type published OK:', contentType.sys.id);

    createEntries(contentType);
}

function createEntries(contentType) {
    var entries = data.entries,
        createdDestContentTypeId = contentType.sys.id;

    data.log('Creating entries for content type:', createdDestContentTypeId, contentType.name);

    for (var i = 0, len = entries.length; i < len; i++) {
        var srcEntry = entries[i],
            srcContentTypeId = srcEntry.sys.contentType.sys.id;

        if (srcContentTypeId == data.contentTypeMapping[createdDestContentTypeId]) {
            var destEntry = {
                fields: srcEntry.fields
            };

            data.log('Source entry to duplicate:', srcEntry);

            createEntry(createdDestContentTypeId, destEntry);
        }
    }
}

function createEntry(contentTypeId, entry) {
    data.log("Creating destination entry:", contentTypeId, entry);

    data.space.createEntry(contentTypeId).then(
        handleCreateEntry,
        function (error) {
            data.log('Destination createEntry ' + contentTypeId + ' ' + entry.sys.id + ' ERROR:', error);
        }
    )
}

function handleCreateEntry(entry) {
    var entryId = entry.sys.id,
        contentTypeId = entry.sys.contentType.sys.id;

    data.log('Destination createEntry OK:', contentTypeId, entry);

    if (entry.fields === undefined) {
        // TODO: currently, this always breaks - need to find out why
        throw new Error('"fields" property of entry should be defined on created entry');
    }

    data.space.getEntry(entryId).then(
        handleGetEntry,
        function (error) {
            data.log('Destination getEntry ' + entryId + ' ERROR:', error);
        }
    )
}

function handleGetEntry(entry) {
    var entryId = entry.sys.id,
        contentTypeId = entry.sys.contentType.sys.id;

    data.log('Destination getEntry OK:', contentTypeId, entry);

    data.space.publishEntry(entry).then(
        handlePublishEntry,
        function (error) {
            data.log('Destination publishEntry ' + entryId + ' ERROR:', error);
        }
    )
}

function handlePublishEntry(entry) {
    data.log('Destination publishEntry OK:', entry.sys.id);
}

module.exports = execute;

/* EOF */