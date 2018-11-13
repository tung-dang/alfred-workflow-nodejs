import { AfWorkflow, storage } from '@alfred-wf-node/core';
import { openLinkExecutor, openInFinderAction } from './executors';
import CommandHandler from './command-handler';
import { Executor } from './types';

const executors = [openLinkExecutor, openInFinderAction];
const commands = {
  LOAD_ALL_LINKS: 'load_all_links',
  OPEN_LINK: 'open_link',
  CLEAR_CACHE: 'clear_cache'
};
const pkg = require('../package.json');

export default class MainApp {
  wf: AfWorkflow;

  constructor() {
    this.wf = new AfWorkflow();
    this.wf.setName(pkg.name);

    const handler = new CommandHandler({
      wf: this.wf
    });

    this.wf.onAction(commands.LOAD_ALL_LINKS, handler.loadAllLinks);
    this.wf.onAction(commands.CLEAR_CACHE, () => storage.clear());

    this.wf.onAction(commands.OPEN_LINK, arg => {
      // TODO: remove this check
      if (typeof arg === 'string') {
        arg = JSON.parse(arg);
      }

      try {
        executors.forEach((executor: Executor) => {
          if (executor.actionName === arg.actionName) {
            executor.execute(arg);
          }
        });
      } catch (error) {
        console.error(
          'ERROR: Can not parse JSON object: ',
          arg,
          'ERROR: ',
          error
        );
      }
    });
  }

  start() {
    this.wf.start();
  }
}
