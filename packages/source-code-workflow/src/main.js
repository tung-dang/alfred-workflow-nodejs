const { Workflow, Item, ICONS, utils: nodeJSUtils, storage, settings } = require('alfred-workflow-nodejs-next');
const executors = require('./executors.js');
const utils = require('./utils');

const commands = {
    LOAD_PROJECTS: 'loadProjects',
    EXECUTE: 'execute',
    CLEAR_CACHE: 'clear_cache'
};

const LoadProjects = require('./load-projects');
const LoadProjectAction = require('./load-project-actions');

(function main() {
    const workflow = new Workflow();
    workflow.setName('alfred-source-code-wf');

    const loadProjects = new LoadProjects({
        workflow
    });
    const loadProjectAction = new LoadProjectAction({
        workflow
    });

    // load projects list
    workflow.onAction(commands.LOAD_PROJECTS, (query) => {
        loadProjects.run(query);
    });
    // load project's actions
    workflow.onSubActionSelected(commands.LOAD_PROJECTS, (query, previousSelectedTitle, previousSelectedArg) => {
        loadProjectAction.run(query, previousSelectedArg);
    });

    // execute project action
    workflow.onAction(commands.EXECUTE, function(arg) {
        // Handle project actions
        executors.forEach((executor) => {
            executor.execute(arg);
        });
    });

    // open config file
    // actionHandler.onAction('config', function(query) {
    //     OpenConfigFileAction.execute();
    // });

    workflow.onAction(commands.CLEAR_CACHE, () => {
        storage && storage.clear();
        settings && settings.clear();
    });

    workflow.start();
})();