// const _ = require('lodash');
const events = require('events');
const loudRejection = require('loud-rejection');

const { SUB_ACTION_SEPARATOR } = require('./constants');
const storage = require('./storage');
const { ICONS, WF_DATA_KEY } = require('./constants');
const Item = require('./Item');


class Workflow {
    constructor() {
        this._items = [];
        this._name = 'AlfredWfNodeJs';
        this.eventEmitter = new events.EventEmitter();
        this.isDebug = false;
    }

    // save item data into storage as "item title" => item data
    static saveItemData(item) {
        let wfData = storage.get(WF_DATA_KEY) || {};
        wfData[item.title] = item;
        storage.set(WF_DATA_KEY, wfData);
    }

    static getItemData(itemTitle) {
        const wfData = storage.get('wfData');
        return wfData ? wfData[itemTitle] : undefined;
    }

    start() {
        const action = process.argv[2];
        const query = process.argv[3];
        process.on('uncaughtException', this.error.bind(this));
        loudRejection(this.error.bind(this));

        this.handle(action, query, this);
    }

    /**
     * Add one feedback item
     */
    addItem(item) {
        const data = item.feedback();
        Workflow.saveItemData(data);
        this._items.push(data);
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
        // let usage = storage.get('usage') || {};

        // this._items.forEach(item => {
        //     const title = item.title;
        //     item.count = usage[title] ? (0 - usage[title]) : 0;
        // });

        //const sortedItems = _.sortBy(this._items, 'count');
        //sortedItems.forEach(item => delete item.count);

        let ret;
        try {
            ret = JSON.stringify({
                items: this._items
            }, null, '\t');

            console.warn('Workflow feedback: ');
            this.output(ret);
            this.clearItems();
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

        this.eventEmitter.on(`action-${action}`, handler);
    }

    /**
     * Register menu item selected handler
     */
    onMenuItemSelected(action, handler) {
        if (!action || !handler) {
            return;
        }

        this.eventEmitter.on(`menuItemSelected-${action}`, handler);
    }

    /**
     * Handle action by delegate to registered action/menuItem handlers
     */
    handle(action, query) {
        if (!query || query.indexOf(SUB_ACTION_SEPARATOR) === -1) {
            // handle first level action
            // console.trace('==================query: ', query);
            query = query && query.trim ? query.trim() : query;
            this.eventEmitter.emit(`action-${action}`, query);
            return;
        }

        // handle sub action
        const tmp = query.split(SUB_ACTION_SEPARATOR);

        const selectedItemTitle = tmp[0].trim();
        query = tmp[1] ? tmp[1].trim() : '';

        this.saveUsage(query, selectedItemTitle);

        const selectedData = Workflow.getItemData(selectedItemTitle);
        this.eventEmitter.emit(
            `menuItemSelected-${action}`,
            query,
            selectedItemTitle,
            selectedData
        );
    }

    /**
     * Unregister all action handlers
     */
    clear() {
        this.eventEmitter.removeAllListeners();
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

    saveUsage(query, itemTitle) {
        if (!query) {
            let usage = storage.get('usage');
            usage = usage || {};

            let count = usage[itemTitle];
            count = count || 0;
            usage[itemTitle] = count + 1;

            storage.set('usage', usage);
        }
    }
}

module.exports = Workflow;