const exec = require('child_process').exec;
const Executor = require('./Executor');
const { EXECUTOR_OPEN_IN_FINDER, EXECUTOR_OPEN_LINK } = require('./helper');

const openLinkExecutor = new Executor({
    actionName: EXECUTOR_OPEN_LINK,

    /**
     * [description]
     * @param  {object} arg [description]
     * @return {String} arg.link -
     * @return {Array} arg.params - list of params that will be replaced into arg.link
     */
    executor: (arg) => {
        if (!arg) {
            return;
        }

        let link = arg.link;

        const params = arg.params;
        if (params && params.length > 0) {
            link = link.replace(/{(\d+)}/g, (match, number) => {
                return params[number] ? params[number] : match;
            });
        }

        exec(`open "${link}"`);
    }
});

const openInFinderAction = new Executor({
    actionName: EXECUTOR_OPEN_IN_FINDER,
    executor: (arg) => {
        if (!arg) {
            return;
        }

        const command = `open "${arg.folderPath}"`;
        return exec(command);
    }
});

module.exports = [
    openInFinderAction,
    openLinkExecutor,
];