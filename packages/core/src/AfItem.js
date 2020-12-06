"use strict";
exports.__esModule = true;
var constants_1 = require("./constants");
/**
 * Each item describes a result row displayed in Alfred.
 * All props of an item are described here: https://www.alfredapp.com/help/workflows/inputs/script-filter/json/
 */
var AfItem = /** @class */ (function () {
    function AfItem(options) {
        if (!options.title) {
            throw new Error('Title is required!');
        }
        var tempData = {
            uid: options.uid || options.title,
            arg: options.arg ? this._hygieneArg(options.arg) : undefined,
            autocomplete: options.autocomplete,
            title: options.title,
            subtitle: options.subtitle || '',
            type: options.type || 'default',
            icon: typeof options.icon === 'string'
                ? {
                    path: options.icon
                }
                : options.icon,
            quicklookurl: options.quicklookurl,
            text: options.text,
            mods: options.mods,
            hasSubItems: !!options.hasSubItems,
            match: options.match || options.title + ' | ' + options.subtitle
        };
        if (tempData.hasSubItems) {
            tempData.valid = false;
        }
        else {
            tempData.valid =
                typeof options.valid === 'undefined' ? true : options.valid;
        }
        if (tempData.hasSubItems) {
            tempData.autocomplete = tempData.title + " " + constants_1.SUB_ACTION_DIVIDER_SYMBOL + " ";
        }
        if (tempData.mods) {
            for (var key in tempData.mods) {
                var obj = tempData.mods[key];
                if (typeof obj.arg !== 'string') {
                    obj.arg = this._hygieneArg(obj.arg);
                }
            }
        }
        if (!tempData.icon) {
            tempData.icon = this._getDefaultIcon();
        }
        this._data = tempData;
    }
    AfItem.prototype._getDefaultIcon = function () {
        return {
            path: constants_1.ICON_DEFAULT
        };
    };
    /**
     * Get value of an item by key
     * @param key
     */
    AfItem.prototype.get = function (key) {
        return this._data[key];
    };
    /**
     * Get internal data object
     */
    AfItem.prototype.getAlfredItemData = function () {
        return this._data;
    };
    /**
     * `arg` props is passed as an object and we need to convert it to string type so that Alfred can understand.
     * @param arg
     * @returns {String}
     * @private
     */
    AfItem.prototype._hygieneArg = function (arg) {
        if (typeof arg === 'object') {
            return JSON.stringify(arg);
        }
        if (typeof arg === 'string') {
            return arg;
        }
        return '';
    };
    return AfItem;
}());
exports["default"] = AfItem;
