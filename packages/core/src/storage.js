"use strict";
exports.__esModule = true;
var storage = require("node-persist");
var Storage = /** @class */ (function () {
    function Storage() {
        storage.initSync({
            ttl: true,
            stringify: function (data) {
                return JSON.stringify(data, null, '  ');
            }
        });
    }
    Storage.prototype.set = function (key, value, ttl) {
        if (ttl) {
            storage.setItemSync(key, value, {
                ttl: ttl
            });
        }
        else {
            storage.setItemSync(key, value);
        }
    };
    Storage.prototype.get = function (key) {
        return storage.getItemSync(key);
    };
    Storage.prototype.remove = function (key) {
        storage.removeItemSync(key);
    };
    Storage.prototype.clear = function () {
        storage.clearSync();
    };
    Storage.prototype.setSetting = function (key, value) {
        var settings = this.get('settings');
        settings = settings || {};
        settings[key] = value;
        this.set('settings', settings);
    };
    Storage.prototype.getSetting = function (key) {
        var settings = this.get('settings');
        if (settings) {
            return settings[key];
        }
    };
    Storage.prototype.removeSetting = function (key) {
        var settings = this.get('settings');
        if (settings) {
            delete settings[key];
        }
    };
    Storage.prototype.clearSetting = function () {
        this.remove('settings');
    };
    return Storage;
}());
var storageInstance = new Storage();
exports["default"] = storageInstance;
