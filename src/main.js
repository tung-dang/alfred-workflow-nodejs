const Item = require('./Item');
const Workflow = require('./Workflow');
const { utils } = require('./utilities');
const { ICONS } = require('./constants');
const settings = require('./settings');
const storage = require('./storage');
const actionHandler = require('./actionHandler');


// module export
module.exports = {
    Workflow,
    actionHandler: actionHandler,
    storage,
    settings,
    utils,
    ICONS,
    run: function() {
        const action = process.argv[2];
        const query = process.argv[3];

        actionHandler.handle(action, query);
    },
    Item
};