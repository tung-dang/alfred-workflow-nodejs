const { ICONS, Item, utils: nodeJSUtils } = require('alfred-workflow-nodejs-next');
const executors = require('./executors.js');


class LoadProjectActions {
    constructor(options) {
        this.workflow = options.workflow;
    }

    run(query, arg) {
        const projectActions = executors;

        const filteredActions = nodeJSUtils.filter(query, projectActions, function(projectAction) {
            return projectAction.filterKey ? projectAction.filterKey().toLowerCase() : '';
        });

        if (filteredActions.length === 0) {
            return;
        }

        const items = [];

        filteredActions.forEach((projectAction) => {
            const item = projectAction.build ? projectAction.build(arg) : null;

            if (item) {
                items.push(item);
            }
        });

        this.workflow.addItems(items);
        this.workflow.feedback();
    }
}

module.exports = LoadProjectActions;