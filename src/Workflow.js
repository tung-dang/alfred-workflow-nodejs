const events = require('events');

const { SUB_ACTION_SEPARATOR } = require('./constants');
const storage = require('./storage');
const { ICONS, WF_DATA_KEY } = require('./constants');
const Item = require('./Item');


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

    start() {
        const actionName = process.argv[2];
        const query = process.argv[3];
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
    feedback() {
        let ret;
        try {
            ret = JSON.stringify({
                items: this._items
            }, null, '\t');

            console.warn('Workflow feedback: ');
            this.output(ret);
            this.clearItems();
            return ret;
        } catch (e) {
            console.warn('Can not generate JSON string', this._items);
        }
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
        console.warn('Error: ', title, subtitle);

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
            subtitle: '...🤞',
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

        this._eventEmitter.on(`action-${action}`, handler);
    }

    /**
     * Register menu item selected handler
     */
    onSubActionSelected(action, handler) {
        if (!action || !handler) {
            return;
        }

        this._eventEmitter.on(`subActionSelected-${action}`, handler);
    }

    /**
     * Handle action by delegate to registered action/subAction handlers
     */
    _trigger(action, query) {
        if (!query || query.indexOf(SUB_ACTION_SEPARATOR) === -1) {
            // handle first level action
            this._eventEmitter.emit(`action-${action}`, this._sanitizeQuery(query));
            return;
        }

        // handle sub action
        const arrays = query.split(SUB_ACTION_SEPARATOR);
        
        if (arrays.length >= 2) {
            const previousActionTitleSelected = this._sanitizeQuery(arrays[arrays.length - 2]);
            query = this._sanitizeQuery(arrays[arrays.length - 1]); // last string is query

            let previousArgActionSelected = Workflow._getItemArg(previousActionTitleSelected);
            try {
                previousArgActionSelected = JSON.parse(previousArgActionSelected);
            } catch(e) {
                console.warn('Can not convert arg string into Object!');
            }

            this._eventEmitter.emit(
                `subActionSelected-${action}`,
                query,
                previousActionTitleSelected,
                previousArgActionSelected
            );
        }
    }

    _sanitizeQuery(query) {
        query = query && query.trim ? query.trim() : query;
        return query;
    }

    output(str) {
        try {
            console.warn('Workflow feedback: ');
            if (this.isDebug) {
                console.warn(str);
            } else {
                console.log(str);
            }
        } catch (e) {
            console.warn('Can not generate JSON string', this._items);
        }
    }
}

module.exports = Workflow;