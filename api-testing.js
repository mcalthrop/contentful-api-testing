// Testing the Contentful API with Javascript.

(function () {

    var contentfulManagement = require('contentful-management'),
        log = require('log'),
        protocol = 'http',
        cdnHost = 'cdn.contentful.com',
        source = {
            config: {
                protocol: protocol,
                host: cdnHost,
                spaceName: 'REPLACE_WITH_VALID_SPACE_NAME',
                spaceId: 'REPLACE_WITH_VALID_SPACE_ID',
                accessToken: 'REPLACE_WITH_VALID_ACCESS_TOKEN'
            }
        };

    source.client = contentfulManagement.createClient({
        accessToken: source.config.accessToken,
        host: source.config.host,
        secure: false
    });
    console.log(source.client);

    source.space = source.client.getSpace().then(log.ok, log.fail);
    console.log(source.space);

    source.contentTypes = source.client.contentTypes().then(log.ok, log.fail);
    console.log(source.contentTypes);

}());

// EOF