import {
  Workflow,
  storage,
  settings
} from '@alfred-wf-node/core';
import executors from './executors';

const commands = {
  LOAD_PROJECTS: 'loadProjects',
  EXECUTE_AN_ACTION: 'execute',
  CLEAR_CACHE: 'clear_cache'
};

import LoadProjects from './actions/LoadProjects';
import LoadProjectActions from './actions/LoadProjectActions';
import { Executor } from './types';

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
    this.wf.onAction(commands.LOAD_PROJECTS, loadProjects.executeLoadProjects);
    // load project's actions
    this.wf.onSubActionSelected(commands.LOAD_PROJECTS,loadProjectAction.executeLoadActionsOfProject);

    // execute project action
    this.wf.onAction(commands.EXECUTE_AN_ACTION, function(arg) {
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
