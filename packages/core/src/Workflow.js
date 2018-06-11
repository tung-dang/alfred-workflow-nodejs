const events = require('events');
const fs = require('fs');

const { SUB_ACTION_DIVIDER_SYMBOL } = require('./constants');
const storage = require('./storage');
const { ICONS, WF_DATA_KEY } = require('./constants');
const Item = require('./Item');
const utils = require('./utilities');

const ACTION_NAMESPACE_EVENT = 'action';
const SUB_ACTION_NAMESPACE_EVENT = 'subActionSelected';

class Workflow {
    constructor(options) {
        options = options || {};

        this._items = [];
        this._name = 'AlfredWfNodeJs';
        this._eventEmitter = new events.EventEmitter();
        this.isDebug = options.isDebug;
    }

    static _saveItemArg(item) {
        let wfData = storage.get(WF_DATA_KEY) || {};
        const data = item.getData();
        wfData[data.title] = data.arg;
        storage.set(WF_DATA_KEY, wfData);
    }

    static _getItemArg(itemTitle) {
        const wfData = storage.get(WF_DATA_KEY);
        return wfData ? wfData[itemTitle] : undefined;
    }

    /* istanbul ignore next */
    start() {
        const args = Array.prototype.slice.apply(this, arguments);
        let actionName;
        let query;

        if (args.length === 0) {
            actionName = process.argv[2];
            query = process.argv[3];
        } else {
            actionName = args[0];
            query = args[1];
        }

        process.on('uncaughtException', this.error.bind(this));

        this._trigger(actionName, query, this);
    }

    /**
     * Add one feedback item
     */
    addItem(item) {
        if (item instanceof Item) {
            Workflow._saveItemArg(item);
            this._items.push(item.getData());
        } else {
            this.error('ERROR: item is not an instance of Item class!');
        }
    }

    /**
     * Add many feedback items
     */
    addItems(items) {
        items.forEach((item) => this.addItem(item));
    }

    /**
     * Clear all feedback items
     */
    clearItems() {
        this._items = [];
        // storage.remove(WF_DATA_KEY);
    }

    /**
     * Set workflow name
     */
    setName(name) {
        this._name = name;
    }

    /**
     * Get workflow name
     */
    getName() {
        return this._name;
    }

    /**
     * Generate feedback
     */
    feedback(strFeedback) {
        let strOutput = '';

        try {
            if (strFeedback) {
                strOutput = strFeedback;
            } else {
                strOutput = JSON.stringify({
                    items: this._items
                }, null, '  ');
            }

            utils.debug('Workflow feedback: ');
            fs.writeFile("test-json-output.json", strOutput);
            this.output(strOutput);
            this.clearItems();

            return strOutput;
        } catch (e) {
            utils.debug('Can not generate JSON string', this._items);
        }

        return strOutput;
    }

    /**
     * Generate info fedback
     */
    info(title, subtitle) {
        this.clearItems();
        this.addItem(new Item({
            title,
            subtitle,
            valid: true,
            hasSubItems: false,
            icon: ICONS.INFO
        }));

        return this.feedback();
    }

    /**
     * Generating warning feedback
     */
    warning(title, subtitle) {
        this.clearItems();
        this.addItem(new Item({
            title,
            subtitle,
            valid: true,
            hasSubItems: false,
            icon: ICONS.WARNING
        }));

        return this.feedback();
    }

    /**
     * Generating error feedback
     */
    error(title, subtitle) {
        utils.debug('Error: ', title, subtitle);

        this.clearItems();
        this.addItem(new Item({
            title,
            subtitle,
            valid: true,
            hasSubItems: false,
            icon: ICONS.ERROR
        }));

        return this.feedback();
    }

    /**
     * Show loading data
     */
    showLoading() {
        this.clearItems();

        this.addItem(new Item({
            title: 'Loading',
            subtitle: '...??',
            icon: ICONS.CLOCK
        }));

        return this.feedback();
    }

    /**
     * Register action handler
     */
    onAction(action, handler) {
        if ((typeof action !== 'string') ||
            (typeof handler !== 'function')) {

            console.error('ERROR - action and handler should be defined!');
            return;
        }

        this._eventEmitter.on(`${ACTION_NAMESPACE_EVENT}-${action}`, handler);
    }

    /**
     * Register menu item selected handler
     */
    onSubActionSelected(action, handler) {
        if (!action || !handler) {
            return;
        }

        this._eventEmitter.on(`${SUB_ACTION_NAMESPACE_EVENT}-${action}`, handler);
    }

    /**
     * Handle action by delegate to registered action/subAction handlers
     */
    _trigger(actionName, query) {
        const tempQuery = this._sanitizeQuery(query);

        // handle first level action
        if (!tempQuery ||
            (typeof tempQuery === 'object') ||
            (typeof tempQuery === 'string' && tempQuery.indexOf(SUB_ACTION_DIVIDER_SYMBOL) === -1)) {
            this._eventEmitter.emit(`${ACTION_NAMESPACE_EVENT}-${actionName}`, tempQuery);
            return;
        }

        // handle sub action
        const arrays = tempQuery.split(SUB_ACTION_DIVIDER_SYMBOL);

        if (arrays.length >= 2) {
            const previousActionTitleSelected = this._sanitizeQuery(arrays[arrays.length - 2]);
            query = this._sanitizeQuery(arrays[arrays.length - 1]); // last string is query

            let previousArgActionSelected = Workflow._getItemArg(previousActionTitleSelected);
            try {
                previousArgActionSelected = JSON.parse(previousArgActionSelected);
            } catch(e) {
                utils.debug('Can not convert arg string into Object!');
            }

            this._eventEmitter.emit(
                `${SUB_ACTION_NAMESPACE_EVENT}-${actionName}`,
                query,
                previousActionTitleSelected,
                previousArgActionSelected
            );
        }
    }

    /**
     * Clear everything.
     */
    reset() {
        this._items = [];
        this._name = '';
        this._eventEmitter.removeAllListeners();
        storage.clear();
    }

    _sanitizeQuery(rawQuery) {
        let finalQuery = rawQuery;

        try {
            finalQuery = JSON.parse(rawQuery);
        } catch(e) {
            // can not parse to object, we keep it as string
            finalQuery = rawQuery;
        }

        finalQuery = finalQuery && finalQuery.trim ? finalQuery.trim() : finalQuery;
        return finalQuery;
    }

    /* istanbul ignore next */
    output(str) {
        try {
            utils.debug('Workflow feedback: ');
            if (this.isDebug || process.env.NODE_ENV === 'testing') {
                utils.debug(str);
            } else {
                console.log(str);
            }
        } catch (e) {
            utils.debug('Can not generate JSON string', this._items);
        }
    }
}

module.exports = Workflow;
