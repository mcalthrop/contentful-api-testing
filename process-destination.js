/*global module, require */

/**
 * Part of the script to duplicate a Space in the Contentful CMS.
 *
 * This script processes the destination:
 *  - create the client
 *  - get the Space (should exist, and be empty)
 *  - create each of the Content Types that we have been passed in
 *  - call the onComplete() method
 *
 *  NOTE: incomplete! Creating content types on destination fails. WIP.
 */

var contentfulManagement = require('contentful-management'),
    data = {};

function execute(log, config, contentTypes, onComplete) {
    data.log = log;
    data.config = config;
    data.contentTypes = contentTypes;
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

    data.log('Destination client:', data.client);
}

function getSpace() {
    data.client.getSpace(data.config.spaceId).then(
        handleSpace,
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
                name: srcContentType.name,
                description: srcContentType.description,
                displayField: srcContentType.displayField,
                fields: srcContentType.fields
            };

        data.log('  Creating content type:', i, destContentType.name);

        // TODO: remove
        // BEGIN DEBUG stuff
        data.log('  --- src  : ', srcContentType);
        data.log('  --- dest :', destContentType);
        // END DEBUG stuff

        data.space.createContentType(destContentType).then(
            handleCreateContentType,
            function (error) {
                data.log('Destination createContentType ' + destContentType.name + ' ERROR:', error);
            }
        );

        // TODO: remove this once I've got the script working:
        return;
    }

    data.onComplete();
}

function handleCreateContentType(createdContentType) {
    data.log('  Destination created content type OK:', createdContentType.name);
}

module.exports = execute;

/* EOF */