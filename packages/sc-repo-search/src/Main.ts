import {
  Workflow,
  storage,
  settings
} from '@alfred-wf-node/core';
import executors from './executors';

const commands = {
  LOAD_PROJECTS: 'loadProjects',
  EXECUTE: 'execute',
  CLEAR_CACHE: 'clear_cache'
};

import LoadProjects from './actions/LoadProjects';
import LoadProjectActions from './actions/LoadProjectActions';
import { Executor, CommandParams } from './types';

const pkg = require('../package.json');

export default class MainApp {
  wf: Workflow;

  constructor() {
    this.wf = new Workflow();
    this.wf.setName(pkg.name);

    const loadProjects = new LoadProjects({
      wf: this.wf
    });
    const loadProjectAction = new LoadProjectActions({
      wf: this.wf
    });

    // load projects list
    this.wf.onAction(commands.LOAD_PROJECTS, loadProjects.run);
    // load project's actions
    this.wf.onSubActionSelected(
      commands.LOAD_PROJECTS,
      (
        query: string,
        previousSelectedTitle: string,
        previousSelectedArg: CommandParams
      ) => {
        console.debug(
          '==================previousSelectedTitle',
          previousSelectedTitle
        );
        loadProjectAction.run(query, previousSelectedArg);
      }
    );

    // execute project action
    this.wf.onAction(commands.EXECUTE, function(arg) {
      // Handle project actions
      Array.from(executors).forEach((executor: Executor) => {
        executor.execute(arg);
      });
    });

    // open config file
    // actionHandler.onAction('config', function(query) {
    //     OpenConfigFileAction.execute();
    // });

    this.wf.onAction(commands.CLEAR_CACHE, () => {
      storage && storage.clear();
      settings && settings.clear();
    });
  }

  start() {
    this.wf.start();
  }
}
