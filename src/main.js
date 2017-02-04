const Item = require('./Item');
const Workflow = require('./Workflow');
const { utils } = require('./utilities');
const { ICONS } = require('./constants');
const storage = require('./storage');
const Settings = require('./Settings');
const actionHandler = require('./actionHandler');


// module export
module.exports = {
    storage,
    Workflow,
    actionHandler: actionHandler,
    settings: Settings,
    utils,
    ICONS,
    run: function() {
        const action = process.argv[2];
        const query = process.argv[3];

        actionHandler.handle(action, query);
    },
    Item
};