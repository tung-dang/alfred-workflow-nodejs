"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const helpers_1 = require("./helpers");
exports.openLinkExecutor = {
    actionName: helpers_1.EXECUTOR_OPEN_LINK,
    /**
     * [description]
     * @param  {object} arg [description]
     * @return {String} arg.link -
     * @return {Array} arg.params - list of params that will be replaced into arg.link
     */
    execute: arg => {
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
        child_process_1.exec(`open "${link}"`);
    }
};
exports.openInFinderAction = {
    actionName: helpers_1.EXECUTOR_OPEN_IN_FINDER,
    execute: arg => {
        if (!arg) {
            return;
        }
        const command = `open "${arg.folderPath}"`;
        return child_process_1.exec(command);
    }
};
