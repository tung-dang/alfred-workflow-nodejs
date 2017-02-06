const { removeEmptyProp } = require('./utilities');
const constants = require('./constants');

class Item {
    constructor(data) {
        this.data = removeEmptyProp(data);
    }

    /**
     * Generate feedback for a item
     */
    feedback() {
        const item = {
            uid: this.data.uid,
            arg: this._updateArg(this.data.arg),
            valid: this.data.valid === true ? 'YES' : 'NO',
            autocomplete: this.data.autocomplete,
            title: this.data.title,
            subtitle: this.data.subtitle,
            type: this.data.type,
            icon: {
                'path': this.icon
            },
            quicklookurl: this.data.quicklookurl,
            text: this.data.text,
            mods: this.data.mods
        };

        if (item.hasSubItems) {
            item.autocomplete = item.title + constants.SUB_ACTION_SEPARATOR;
        }

        return item;
    }


    _updateArg(data) {
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