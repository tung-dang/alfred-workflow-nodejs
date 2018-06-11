import { Workflow, Item, ICONS, storage, settings } from '@alfred-wf-node/core';
import executors from './executors';

const commands = {
  LOAD_PROJECTS: 'loadProjects',
  EXECUTE: 'execute',
  CLEAR_CACHE: 'clear_cache'
};

import LoadProjects from './actions/load-projects';
import LoadProjectActions from './actions/load-project-actions';
import { Executor, CommandParams } from './types';

const pkg = require('../package.json');

export default class MainApp {
  workflow: Workflow;

  constructor() {
    this.workflow = new Workflow();
    this.workflow.setName(pkg.name);

    const loadProjects = new LoadProjects({
      workflow: this.workflow
    });
    const loadProjectAction = new LoadProjectActions({
      workflow: this.workflow
    });

    // load projects list
    this.workflow.onAction(commands.LOAD_PROJECTS, loadProjects.run);
    // load project's actions
    this.workflow.onSubActionSelected(
      commands.LOAD_PROJECTS,
      (
        query: string,
        previousSelectedTitle: string,
        previousSelectedArg: CommandParams
      ) => {
        loadProjectAction.run(query, previousSelectedArg);
      }
    );

    // execute project action
    this.workflow.onAction(commands.EXECUTE, function(arg) {
      // Handle project actions
      Array.from(executors as any).forEach((executor: Executor) => {
        executor.execute(arg);
      });
    });

    // open config file
    // actionHandler.onAction('config', function(query) {
    //     OpenConfigFileAction.execute();
    // });

    this.workflow.onAction(commands.CLEAR_CACHE, () => {
      storage && storage.clear();
      settings && settings.clear();
    });
  }

  start() {
    this.workflow.start();
  }
}
