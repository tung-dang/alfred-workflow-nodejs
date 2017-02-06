const fuzzy = require('fuzzy');
const applescript = require('node-osascript');
const exec = require('child_process').exec;
const utilLib = require("util");

function removeEmptyProp(data) {
    for (let key in data) {
        let value = data[key];

        if (typeof value === 'object') {
            value = removeEmptyProp(value);
            if (!Object.keys(value).length) {
                value = null;
            }
        }

        if (value === undefined ||
            value === null) {
            delete data[key];
        }
    }

    return data;
}


/**
 * If str is json string => return object
 * If not, return str
 */
function _toObjectIfJSONString(str) {
    try {
        str = JSON.parse(str);
    } catch (err) {
        // ignore error
    }

    return str;
}


const utils = {

    filter: function (query, list, keyBuilder) {
        if (!query) {
            return list;
        }

        const options = {
            extract: keyBuilder
        };

        return fuzzy
            .filter(query, list, options)
            .map(item => item.original);
    },

    /**
     * a wrapper of "applescript" module
     * @type {Object}
     */
    applescript: {
        /**
         * execute script
         * @param script
         * @param handler: function(err, result)
         */
        execute: function (script, handler) {
            applescript.execute(script, handler);
        },

        /**
         * execute script file
         * @param path to script file
         * @param variable variable
         * @param handler: function(err, result, raw)
         */
        executeFile: function (path, varibale, handler) {
            applescript.executeFile.apply(this, arguments);
        }
    },


    /**
     * @param data: {arg: 'xyz', variables: {key: value}}
     * @return
     *     string of '{"alfredworkflow": {"arg": "xyz", "variables": {"key": "value"}}}'
     *     or data if data is not type of object
     */
    generateVars: function (data) {
        const ret = updateArg(data);
        // console.log(ret);
        return ret;
    },

    envVars: {
        /**
         * Set environment variable
         * if value is object => store as json string
         */
        set: function (key, value) {
            if (key && value) {
                if (typeof value === 'object') {
                    process.env.key = JSON.stringify(value);
                } else {
                    process.env.key = value;
                }
            }
        },

        /**
         * Get environment variable
         * if data is json => parse and return object
         */
        get: function (key) {
            return _toObjectIfJSONString(process.env[key]);
        }
    },

    wfVars: {
        /**
         * Set wf variable
         * @param key variable name
         * @param value variable value
         * @param callback callback(err)
         */
        set: function (key, value, callback) {
            if (key !== undefined && value !== undefined) {
                // set variable to plist
                const setCommand = utilLib.format('/usr/libexec/PlistBuddy -c "Set :variables:%s \"%s\"" info.plist', key, value);
                exec(setCommand, function (err, stdout, stderr) {
                    // if variable is not in plist => add it to plist
                    if (err) {
                        var addCommand = utilLib.format('/usr/libexec/PlistBuddy -c "Add :variables:%s string \"%s\"" info.plist', key, value);
                        exec(addCommand, function (err, stdout, stderr) {
                            if (callback) {
                                callback(err);
                            }
                            ;
                        });
                    } else {
                        if (callback) {
                            callback(undefined);
                        }
                        ;
                    }
                })
            }
        },

        /**
         * @param key variable name
         * @param callback callback(err, value)
         * @return wf variable
         */
        get: function (key, callback) {
            const getCommand = utilLib.format('/usr/libexec/PlistBuddy -c "Print :variables:%s" info.plist', key);
            exec(getCommand, function (err, stdout, stderr) {
                if (err) {
                    callback(err);
                } else {
                    var value = stdout.trim();
                    callback(undefined, value);
                }

            })
        },

        /**
         * Remove a variable from wf variables
         * @param key variable name
         * @param callback callback(err)
         */
        remove: function (key, callback) {
            const getCommand = utilLib.format('/usr/libexec/PlistBuddy -c "Delete :variables:%s" info.plist', key);
            exec(getCommand, function (err, stdout, stderr) {
                if (callback) {
                    callback(err);
                }
                ;
            })
        },

        /**
         * Use with caution!!!
         * clear all workflow variables
         * @param callback callback(err)
         */
        clear: function (callback) {
            const clearCommand = '/usr/libexec/PlistBuddy -c "Delete :variables" info.plist';
            exec(clearCommand, function (err, stdout, stderr) {
                if (callback) {
                    callback(err)
                }
            })
        }
    }
};

module.exports = {
    removeEmptyProp,
    utils
};