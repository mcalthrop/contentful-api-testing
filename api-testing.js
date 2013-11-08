/*global require, process */

// Testing the Contentful API with Javascript.

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
                host: getEnv('CONTENTFUL_MANAGEMENT_HOSTNAME', true),
                spaceId: getEnv('CONTENTFUL_SPACE_ID', true),
                accessToken: getEnv('CONTENTFUL_ACCESS_TOKEN', true)
            }
        };

    log("Source:", source);

    source.client = contentfulManagement.createClient({
        accessToken: source.config.accessToken,
        host: source.config.host,
        secure: false
    });

    log('Source client:', source.client);

    source.client.getSpace(source.config.spaceId).then(
        function (space) {
            log('Source getSpace OK:', space);
            source.space = space;
        },
        function () {
            log('Source getSpace ERROR:', arguments);
        }
    );
}());

// EOF