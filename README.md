contentful-api-testing
======================

Testing the Javascript API from https://www.contentful.com/ with NodeJS.

## Usage

Clone/fork this project, then:

### Configure your Contentful Spaces

Make sure you have two Spaces configured in Contentful

* one as the source - contains a full set of content types
* the other as the destination - contains NO content types

### Script configuration

You'll then to install the necessary NodeJS modules, and configure the environment setup file:

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

Currently, the script works right up to the point of creating the destination content types - and inexplicably fails.
Work in progress.
