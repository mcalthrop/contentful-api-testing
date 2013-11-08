/*global require */

// Testing the Contentful API with Javascript.

(function () {

    /**
     * Utility function to retrieve the value of an environment variable, and optionally
     * throw an error if the specified variable has not been set.
     *
     * @param {String} varName name of environment variable to retrieve
     * @param {Boolean} throwErrorIfUndefined if the specified variable has not been defined
     *
     * @returns {String} the value of the specified env variable
     */
    function getEnv(varName, throwErrorIfUndefined) {
        var varValue = process.env[varName];

        if (varValue === undefined && throwErrorIfUndefined) {
            throw new ReferenceError('Environment variable is not defined: ' + varName);
        }

        return varValue;
    }

    var contentfulManagement = require('contentful-management'),
        log = console.log.bind(console),
        protocol = 'http',
        source = {
            config: {
                protocol: protocol,
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