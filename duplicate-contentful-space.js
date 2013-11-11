/*global require, process */

/**
 * Use the Contentful JS API to duplicate a Contentful Space.
 *
 * Before using this, please read the README.
 */

(function () {

    var getEnv = require('./get-env'),
        processSource = require('./process-source'),
        processDestination = require('./process-destination'),
        sourceConfig = {
            host: getEnv('SRC_CONTENTFUL_MANAGEMENT_HOSTNAME', true),
            secure: getEnv('SRC_CONTENTFUL_SECURE', true),
            spaceId: getEnv('SRC_CONTENTFUL_SPACE_ID', true),
            accessToken: getEnv('SRC_CONTENTFUL_ACCESS_TOKEN', true)
        },
        destinationConfig = {
            host: getEnv('DEST_CONTENTFUL_MANAGEMENT_HOSTNAME', true),
            secure: getEnv('DEST_CONTENTFUL_SECURE', true),
            spaceId: getEnv('DEST_CONTENTFUL_SPACE_ID', true),
            accessToken: getEnv('DEST_CONTENTFUL_ACCESS_TOKEN', true)
        },
        log = console.log.bind(console);

    processSource(log, sourceConfig, function (contentTypes) {
        processDestination(log, destinationConfig, contentTypes, function () {
            log("Space duplication complete.");
        });
    })
}());

// EOF