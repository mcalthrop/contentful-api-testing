// Testing the Contentful API with Javascript.

(function () {

    var contentfulManagement = require('contentful-management'),
        log = require('log'),
        protocol = 'http',
        cdnHost = 'cdn.contentful.com',
        source = {
            config: {
                protocol: protocol,
                cdnHost: cdnHost,
                spaceName: 'cms-master',
                spaceId: 'e2h9ve8r21wy',
                accessToken: '5e4de9569f077ad4c4f8eda84305d3ae73284adc0e15a8df2fe7151f0fe318ba'
            }
        };

    source.client = contentfulManagement.createClient({
        accessToken: source.config.accessToken,
        secure: false
    });
    console.log(source.client);

    source.space = source.client.getSpace().then(log.ok, log.fail);
    console.log(source.space);

    source.contentTypes = source.client.contentTypes().then(log.ok, log.fail);
    console.log(source.contentTypes);

}());

// EOF