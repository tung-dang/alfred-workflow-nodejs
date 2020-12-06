"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.memorizePromise = exports.applescript = exports.filter = exports.debug = void 0;
var fuzzy = require("fuzzy");
var appleScript = require("node-osascript");
var storage_1 = require("./storage");
function debug(message) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    // do not log message in test environment
    if (process.env.NODE_ENV === 'testing') {
        return;
    }
    console.warn.apply(console, __spreadArrays([message], args));
}
exports.debug = debug;
function filter(query, list, keyBuilder) {
    if (!query) {
        return list;
    }
    var options = {
        extract: keyBuilder ? keyBuilder : function (item) { return item.toString(); }
    };
    return fuzzy.filter(query, list, options).map(function (item) { return item.original; });
}
exports.filter = filter;
/**
 * a wrapper of "applescript" module
 * @type {Object}
 */
exports.applescript = {
    /**
     * execute script
     * @param script
     * @param handler: function(err, result)
     */
    /* istanbul ignore next */
    execute: function (script, handler) {
        appleScript.execute(script, handler);
    },
    /**
     * execute script file
     * @param path to script file
     * @param variable variable
     * @param handler: function(err, result, raw)
     */
    /* istanbul ignore next */
    executeFile: function ( /*path, varibale, handler*/) {
        appleScript.executeFile.apply(this, arguments);
    }
};
function memorizePromise(keyCache, ttl, func, isDebug) {
    ttl = ttl || true; // true means 24 caching
    var dataFromCache = storage_1["default"].get(keyCache);
    if (dataFromCache && !isDebug) {
        debug('Get data from cache with key=', keyCache);
        return new Promise(function (resolve) { return resolve(dataFromCache); });
    }
    debug('Start to get new fresh data since can not find data from cache: ', keyCache);
    return func().then(function (data) {
        debug('Save data to cache, key=', keyCache);
        debug('data=', data);
        storage_1["default"].set(keyCache, data, ttl);
        return data;
    });
}
exports.memorizePromise = memorizePromise;
