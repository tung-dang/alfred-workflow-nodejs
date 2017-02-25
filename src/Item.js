const { removeEmptyProp } = require('./utilities');
const constants = require('./constants');

/**
 * All props of an item are described here: https://www.alfredapp.com/help/workflows/inputs/script-filter/json/
 */
class Item {
    constructor(data) {
        this.data = data;
    }

    /**
     * Generate feedback for a item
     */
    feedback() {
        // const isValid = (typeof this.data.valid !== 'undefined') ? !!this.data.valid : true;
        // console.warn('==================isValid: ', isValid);

        const item = {
            uid: this.data.uid,
            arg: this._updateArg(this.data.arg),
            autocomplete: this.data.autocomplete,
            title: this.data.title,
            subtitle: this.data.subtitle,
            type: this.data.type,
            icon: {
                'path': this.data.icon
            },
            quicklookurl: this.data.quicklookurl,
            text: this.data.text,
            mods: this.data.mods,
            valid: !!this.data.valid, // default: true
            hasSubItems: !!this.data.hasSubItems, // default: false
        };


        if (item.hasSubItems) {
            item.autocomplete = `${item.title} ${constants.SUB_ACTION_SEPARATOR} `;
        }

        return item;
    }

    /**
     * Get value of an item by key
     * @param key
     */
    get(key) {
        return this.data[key];
    }

    _updateArg(data) {
        if (!data) {
            return '';
        }

        if (typeof data === "object") {
            var _arg = data.arg;
            var _variables = data.variables;
            return JSON.stringify({
                alfredworkflow: {
                    arg: _arg,
                    variables: _variables
                }
            });
        }

        return data;
    }
}

module.exports = Item;