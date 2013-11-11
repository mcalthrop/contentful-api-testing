/*global module, process */

/**
 * Utility to retrieve the value of an environment variable, and optionally
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

module.exports = getEnv;

/* EOF */