"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const alfred_workflow_nodejs_next_1 = require("alfred-workflow-nodejs-next");
const executors_1 = require("./executors");
const command_handler_1 = require("./command-handler");
const executors = [executors_1.openLinkExecutor, executors_1.openInFinderAction];
const commands = {
    LOAD_ALL_LINKS: 'load_all_links',
    OPEN_LINK: 'open_link',
    CLEAR_CACHE: 'clear_cache'
};
class MainApp {
    constructor() {
        this.workflow = new alfred_workflow_nodejs_next_1.Workflow();
        this.workflow.setName('alfred-go-wf');
        const handler = new command_handler_1.default({
            workflow: this.workflow
        });
        this.workflow.onAction(commands.LOAD_ALL_LINKS, handler.loadAllLinks);
        this.workflow.onAction(commands.CLEAR_CACHE, () => alfred_workflow_nodejs_next_1.storage.clear());
        this.workflow.onAction(commands.OPEN_LINK, arg => {
            try {
                executors.forEach((executor) => {
                    if (executor.actionName === arg.actionName) {
                        executor.execute(arg);
                    }
                });
            }
            catch (error) {
                console.error('ERROR: Can not parse JSON object: ', arg, 'ERROR: ', error);
            }
        });
    }
    start() {
        this.workflow.start();
    }
}
exports.default = MainApp;
