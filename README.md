contentful-api-testing
======================

Testing the Javascript API from https://www.contentful.com/ with NodeJS.

## Duplicate Contentful Space

The `duplicate-contentful-space.js` script takes an existing Contentful Space, and duplicates all the Content Types into another existing Contentful Space.

Note:

- that Entries **are** duplicated, as well as Content Types
- the script will only run successfully once: it will fail if it has already been run with the same source and destination Spaces &ndash; see [Pipeline](#pipeline)

Clone/fork this project, then:

### Configure your Contentful Spaces

Make sure you have two Spaces configured in Contentful:
- source:
  - create the full set of content types you want
  - make a note of the Space ID (Space Settings &gt; Key)

- destination:
  - contains NO content types
  - get a management API access token: easiest way is to browse to the [management API documentation](https://www.contentful.com/developers/documentation/content-management-api/), log in, and make a note of the resultant access token
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

## Pipeline

Next pieces of functionality to work on:

- allow option of copying only Content Types, but not Entries (via env var)
- when duplicating Content Types, check if they already exist before creating
- ditto for Entries
