const _ = require('lodash');

const storage = require('./storage');
const { ICONS, WF_DATA_KEY } = require('./constants');
const Item = require('./Item');

class Workflow {
    constructor() {
        this._items = [];
        this._name = 'AlfredWfNodeJs';
        // this.handlers = {};
    }

    // save item data into storage as "item title" => item data
    static saveItemData(item) {
        if (item.data) {
            let wfData = storage.get(WF_DATA_KEY) || {};
            wfData[item.title] = item.data;
            storage.set(WF_DATA_KEY, wfData);
        }
    }

    static getItemData(itemTitle) {
        itemTitle = (typeof itemTitle === 'string')
                ? itemTitle.normalize()
                : itemTitle;

        const wfData = storage.get('wfData');
        return wfData ? wfData[itemTitle] : undefined;
    }

    /**
     * Add feedback item
     */
    addItem(item) {
        Workflow.saveItemData(item);
        this._items.push(item.feedback());
    }

    /**
     * Clear all feedback items
     */
    clearItems() {
        this._items = [];
        storage.remove(WF_DATA_KEY);
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
        let usage = storage.get('usage') || {};

        this._items.forEach(item => {
            const title = item.title;
            item.count = usage[title] ? (0 - usage[title]) : 0;
        });

        const sortedItems = _.sortBy(this._items, 'count');
        sortedItems.forEach(item => delete item.count);

        const ret = JSON.stringify({
            items: sortedItems
        });

        if (ret) {
            // console.log('Workflow feedback: ');
            // don't remove this line, it will help generate data into UI
            console.log(ret);
            return ret;
        }

        this.clearItems();
        this.error('ERROR', 'can get give feedback in workflow', sortedItems)
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
     * Generate warning feedback
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
     * Generate error feedback
     */
    error(title, subtitle) {
        this.clearItems();
        this.addItem(new Item({
            title,
            subtitle,
            icon: ICONS.ERROR
        }));

        return this.feedback();
    }
}

module.exports = Workflow;