const AlfredNode = require('alfred-workflow-nodejs-next');

const {
    Workflow,
    storage
} = AlfredNode;
const executors = require('./executors');

const commands = {
    LOAD_ALL_LINKS: 'load_all_links',
    OPEN_LINK: 'open_link',
    CLEAR_CACHE: 'clear_cache'
};
const CommandHandler = require('./command-handler');

(function initWorkflow() {
    const workflow = new Workflow();
    workflow.setName('alfred-go-wf');

    const handler = new CommandHandler({
        workflow
    });

    workflow.onAction(commands.LOAD_ALL_LINKS, handler.loadAllLinks);
    workflow.onAction(commands.CLEAR_CACHE, () => storage.clear());

    workflow.onAction(commands.OPEN_LINK, (arg) => {
        try {
            const matchedExecutor = executors.find((executor) => {
                if (executor.actionName === arg.actionName) {
                    return true;
                }
                return false;
            });
            matchedExecutor && matchedExecutor.execute(arg);
        } catch (error) {
            console.error('ERROR: Can not parse JSON object: ', arg, 'ERROR: ', error);
        }
    });

    workflow.start();
}());
