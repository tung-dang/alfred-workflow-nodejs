// const { removeEmptyProp } = require('./utilities');
const constants = require('./constants');

/**
 * Each item describes a result row displayed in Alfred.
 * All props of an item are described here: https://www.alfredapp.com/help/workflows/inputs/script-filter/json/
 */
class Item {
    constructor(options) {
        const tempData = {
            uid: options.uid,
            arg: this._hygieneArg(options.arg),
            autocomplete: options.autocomplete,
            title: options.title,
            subtitle: options.subtitle || '',
            type: options.type,
            icon: (typeof options.icon === 'string')
                ? { path: options.icon }
                : options.icon,
            quicklookurl: options.quicklookurl || options.title,
            text: options.text,
            mods: options.mods,
            valid: (typeof options.valid === 'undefined') ? true : options.valid, // default: true
            hasSubItems: !!options.hasSubItems, // default: false
        };

        if (tempData.hasSubItems) {
            tempData.valid = false;
        }

        if (tempData.hasSubItems) {
            tempData.autocomplete = `${tempData.title} ${constants.SUB_ACTION_DIVIDER_SYMBOL} `;
        }

        if (tempData.mods) {
            for(let key in tempData.mods) {
                const obj = tempData.mods[key];
                if (typeof obj.arg !== 'string') {
                    obj.arg = this._hygieneArg(obj.arg);
                }
            }
        }

        this._data = tempData;
    }

    /**
     * Get value of an item by key
     * @param key
     */
    get(key) {
        return this._data[key];
    }

    /**
     * Get internal data object
     */
    getData() {
        return this._data;
    }

    /**
     * `arg` props is passed as an object and we need to convert it to string type so that Alfred can understand.
     * @param arg
     * @returns {String}
     * @private
     */
    _hygieneArg(arg) {
        if (typeof arg === 'object') {
            return JSON.stringify(arg);
        }

        if (typeof arg === 'string') {
            return arg;
        }

        return '';
    }
}

module.exports = Item;