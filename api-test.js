// Testing the Contentful API with Javascript.

(function () {

    var contentful = require('contentful'),
        log = require('log'),
        protocol = 'http',
        cdnHost = 'cdn.contentful.com',
        srcConfig = {
            protocol: protocol,
            cdnHost: cdnHost,
            spaceName: 'cms-master',
            spaceId: 'e2h9ve8r21wy',
            accessToken: '5e4de9569f077ad4c4f8eda84305d3ae73284adc0e15a8df2fe7151f0fe318ba'
        },
        destConfig = {
            protocol: protocol,
            cdnHost: cdnHost,
            spaceName: 'cms-test',
            spaceId: '',
            accessToken: ''
        };

    var srcClient = contentful.createClient({
        accessToken: srcConfig.accessToken,
        space: srcConfig.spaceId
    });

    var srcSpace = srcClient.space().then(log.ok, log.fail);

    var srcContentTypes = srcClient.contentTypes().then(log.ok, log.fail);

    console.log(srcClient);
    console.log(srcSpace);
    console.log(srcContentTypes);

}());

// EOF