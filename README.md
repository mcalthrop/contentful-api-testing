contentful-api-testing
======================

Testing the Javascript API from https://www.contentful.com/ with NodeJS.

## Duplicate Contentful Space

The `duplicate-contentful-space.js` script takes an existing Contentful Space, and duplicates all the Content Types into another existing Contentful Space.

Note that Entries **are** duplicated, as well as Content Types.

Clone/fork this project, then:

### Configure your Contentful Spaces

Make sure you have two Spaces configured in Contentful:
- source:
  - create the full set of content types you want
  - create an access token (Content Delivery &gt; Create API Key), and make a note of it
  - make a note of the Space ID (Space Settings &gt; Key)

- destination:
  - contains NO content types
  - get an access token: easiest way is to browse to the [management API documentation](https://www.contentful.com/developers/documentation/content-management-api/), log in, and make a note of the resultant access token
  - make a note of the Space ID (Space Settings &gt; Key)

### Script configuration

You'll then to install the necessary NodeJS modules, and configure the environment setup file, populating the required variables with the values you made a note of above:

``` sh
npm install
vi env-setup.bash                       # store required environment variables in setup script
. env-setup.bash                        # set the environment variables in your current shell
```

### Run the script

Finally, run the NodeJS script:

``` sh
node duplicate-contentful-space.js      # run the NodeJS script to duplicate the Space
```

## Issues

Script works up until creating the new entry: it returns success, but there is no data in the `fields` property (even though that data has been passed to the `createEntry()` method).

This means that when the script tries to publish the new entry, it fails validation, because there is no data.

I've even tried adding a step in to call `getEntry()` immediately after entry creation, but that makes no difference.

WIP...
