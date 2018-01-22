const exec = require('child_process').exec;
const Executor = require('./Executor');


const openLinkExecutor = new Executor({
    actionName: 'open_link',

    /**
     * [description]
     * @param  {object} arg [description]
     * @return {String} arg.link -
     * @return {Array} arg.params - list of params that will be replaced into arg.link
     */
    executor: (arg) => {
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

module.exports = {
    openLinkExecutor
};