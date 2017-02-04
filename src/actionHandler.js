const events = require('events');
const eventEmitter = new events.EventEmitter();

const { SUB_ACTION_SEPARATOR } = require('./utilities');
const storage = require('./storage');
const Workflow = require('./Workflow');

function saveUsage(query, itemTitle) {
    if (!query) {
        let usage = storage.get('usage');
        usage = usage || {};

        let count = usage[itemTitle];
        count = count || 0;
        usage[itemTitle] = count + 1;

        storage.set('usage', usage);
    }
}


const actionHandler = {
    /**
     * Register action handler
     */
    onAction: function(action, handler) {
        if ((typeof action !== 'string') ||
            (typeof handler !== 'function')) {

            console.error('ERROR - action and handler should be defined!');
            return;
        }

        eventEmitter.on(`action-${action}`, handler);
    },

    /**
     * Register menu item selected handler
     */
    onMenuItemSelected: function(action, handler) {
        if (!action || !handler) {
            return;
        }

        eventEmitter.on(`menuItemSelected-${action}`, handler);
    },

    /**
     * Handle action by delegate to registered action/menuItem handlers
     */
    handle: function(action, query) {
        if (!query || query.indexOf(SUB_ACTION_SEPARATOR) === -1) {
            // handle first level action
            eventEmitter.emit(`action-${action}`, query);
        } else {
            // handle sub action
            const tmp = query.split(SUB_ACTION_SEPARATOR);
            const selectedItemTitle = tmp[0].trim();
            query = tmp[1].trim();

            saveUsage(query, selectedItemTitle);

            eventEmitter.emit(
                `menuItemSelected-${action}`,
                query,
                selectedItemTitle,
                Workflow.getItemData(selectedItemTitle)
            );
        }
    },

    /**
     * Unregister all action handlers
     */
    clear: function() {
        eventEmitter.removeAllListeners();
    }
};

module.exports = actionHandler;
