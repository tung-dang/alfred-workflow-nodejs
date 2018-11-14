import { CopyToClipboardAction, OpenInFinderAction } from '@alfred-wf-node/core';
import { exec } from 'child_process';
import { EXECUTOR_OPEN_LINK } from './helpers';
import { Executor } from './types';

const openLinkExecutor: Executor = {
  key: EXECUTOR_OPEN_LINK,

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

const copyToClipboardAction = new CopyToClipboardAction();
const openInFinderAction = new OpenInFinderAction();

const executors = [
  openLinkExecutor,
  copyToClipboardAction,
  openInFinderAction
];

export default executors;
