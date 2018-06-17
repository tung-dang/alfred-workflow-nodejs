import { exec } from 'child_process';
import { EXECUTOR_OPEN_IN_FINDER, EXECUTOR_OPEN_LINK } from './helpers';
import { Executor } from './types';

export const openLinkExecutor: Executor = {
  actionName: EXECUTOR_OPEN_LINK,

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

    exec(`open "${link}"`);
  }
};

export const openInFinderAction: Executor = {
  actionName: EXECUTOR_OPEN_IN_FINDER,
  execute: arg => {
    if (!arg) {
      return;
    }

    const command = `open "${arg.folderPath}"`;
    return exec(command);
  }
};
