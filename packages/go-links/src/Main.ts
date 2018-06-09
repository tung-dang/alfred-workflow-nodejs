import { Workflow, storage } from 'alfred-workflow-nodejs-next';
import { openLinkExecutor, openInFinderAction } from './executors';
import CommandHandler from './command-handler';
import { Executor } from './types';
import { POINT_CONVERSION_HYBRID } from 'constants';

const executors = [openLinkExecutor, openInFinderAction];
const commands = {
  LOAD_ALL_LINKS: 'load_all_links',
  OPEN_LINK: 'open_link',
  CLEAR_CACHE: 'clear_cache'
};
const pkg = require("../package.json");

export default class MainApp {
  workflow: Workflow;

  constructor() {
    this.workflow = new Workflow();
    this.workflow.setName(pkg.name);

    const handler = new CommandHandler({
      workflow: this.workflow
    });

    this.workflow.onAction(commands.LOAD_ALL_LINKS, handler.loadAllLinks);
    this.workflow.onAction(commands.CLEAR_CACHE, () => storage.clear());

    this.workflow.onAction(commands.OPEN_LINK, arg => {
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
    this.workflow.start();
  }
}
