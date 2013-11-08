/*global require, process */

/**
 * Testing the Contentful API with Javascript: duplicate a Contentful space.
 *
 * Before using this, please read the README.
 *
 * NOTE: still incomplete!
 */

(function () {

    /**
     * Utility function to retrieve the value of an environment variable, and optionally
     * throw an error if the specified variable has not been set or is blank.
     *
     * @param {String} varName name of environment variable to retrieve
     * @param {Boolean} throwErrorIfEmpty if the specified variable is empty - ie,
     *          has not been defined, or is blank
     *
     * @returns {String} the value of the specified env variable
     */
    function getEnv(varName, throwErrorIfEmpty) {
        var varValue = process.env[varName];

        if ((varValue === undefined || (!varValue)) && throwErrorIfEmpty) {
            throw new ReferenceError('Environment variable is empty: ' + varName);
        }

        return varValue;
    }

    var contentfulManagement = require('contentful-management'),
        log = console.log.bind(console),
        source = {
            config: {
                host: getEnv('SRC_CONTENTFUL_MANAGEMENT_HOSTNAME', true),
                secure: getEnv('SRC_CONTENTFUL_SECURE', true),
                spaceId: getEnv('SRC_CONTENTFUL_SPACE_ID', true),
                accessToken: getEnv('SRC_CONTENTFUL_ACCESS_TOKEN', true)
            },
            init: function (onComplete) {
                source.onComplete = onComplete;

                source.client = contentfulManagement.createClient({
                    accessToken: source.config.accessToken,
                    host: source.config.host,
                    secure: source.config.secure
                });

                log('Source client:', source.client);

                source.client.getSpace(source.config.spaceId).then(
                    source.handleSpace,
                    function () {
                        log('Client getSpace ERROR:', arguments);
                    }
                );
            },
            handleSpace: function (space) {
                log('Source getSpace OK');
                source.space = space;

                source.space.getContentTypes().then(
                    source.handleContentTypes,
                    function () {
                        log('Source getContentTypes ERROR:', arguments);
                    }
                )
            },
            handleContentTypes: function (contentTypes) {
                log('Source getContentTypes OK');
                source.contentTypes = contentTypes;

                source.onComplete();
            }
        },
        destination = {
            config: {
                host: getEnv('DEST_CONTENTFUL_MANAGEMENT_HOSTNAME', true),
                secure: getEnv('DEST_CONTENTFUL_SECURE', true),
                spaceId: getEnv('DEST_CONTENTFUL_SPACE_ID', true),
                accessToken: getEnv('DEST_CONTENTFUL_ACCESS_TOKEN', true)
            },
            init: function () {
                destination.client = contentfulManagement.createClient({
                    accessToken: destination.config.accessToken,
                    host: destination.config.host,
                    secure: destination.config.secure
                });

                log('Destination client:', destination.client);

                destination.client.getSpace(destination.config.spaceId).then(
                    destination.handleSpace,
                    function () {
                        log('Destination getSpace ERROR:', arguments);
                    }
                )
            },
            handleSpace: function (space) {
                var contentTypes = source.contentTypes;

                destination.space = space;
                log('Destination getSpace OK');

                for (var i = 0, len = contentTypes.length; i < len; i++) {
                    var srcContentType = contentTypes[i],
                        destContentType = {
                            sys: {id: srcContentType.sys.id},
                            name: srcContentType.name,
                            description: srcContentType.description,
                            displayField: srcContentType.displayField,
                            fields: srcContentType.fields
                        };

                    // DEBUG stuff
                    log(i, '--- Creating content type: ---');
                    log('  --- src  : ', srcContentType);
                    log('  --- dest :', destContentType);

                    destination.space.createContentType(destContentType).then(
                        destination.handleCreateContentType,
                        function () {
                            log('Destination createContentType ' + destContentType.name + ' ERROR:', arguments);
                            throw new Error('Could not create content type:', destContentType.name);
                        }
                    );

                    // TODO: remove this once I've got the script working:
                    throw new Error('STOPPING HERE');
                }
            },
            handleCreateContentType: function (createdContentType) {
                log('Destination created content type OK:', createdContentType);
            }
        };

    source.init(destination.init);
}());

// EOF