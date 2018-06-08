"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
exports.openLinkExecutor = {
    actionName: 'open_link',
    /**
     * [description]
     * @param  {object} arg [description]
     * @return {String} arg.link -
     * @return {Array} arg.params - list of params that will be replaced into arg.link
     */
    execute: arg => {
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
