'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const child_process_1 = require('child_process');
exports.openLinkExecutor = {
  actionName: 'open_link',
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
