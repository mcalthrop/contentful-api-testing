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

    log('\n\n\n--------------------------------------------------------------------------------------');
    processSource(log, sourceConfig, function (contentTypes, entries) {
        processDestination(log, destinationConfig, contentTypes, entries, function () {
            log("Space duplication complete.");
        });
    })
}());

// EOF