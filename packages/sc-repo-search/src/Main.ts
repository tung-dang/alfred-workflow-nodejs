import {
  Workflow,
  storage,
  settings
} from '@alfred-wf-node/core';
import { projectActions, /*executeActionByKey*/ } from './actions/project-actions';

const commands = {
  LOAD_PROJECTS: 'loadProjects',
  EXECUTE_AN_ACTION: 'execute',
  CLEAR_CACHE: 'clear_cache'
};

import LoadProjects from './actions/LoadProjects';
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

    // load projects list
    this.wf.onAction(commands.LOAD_PROJECTS, loadProjects.executeLoadProjects);
    // load project's actions
    this.wf.onSubActionSelected(commands.LOAD_PROJECTS,loadProjects.executeLoadActionsOfProject);

    // execute project action
    this.wf.onAction(commands.EXECUTE_AN_ACTION, this._executeSelectedAction);

    this.wf.onAction(commands.CLEAR_CACHE, () => {
      storage && storage.clear();
      settings && settings.clear();
    });
  }

  _executeSelectedAction = (arg) => {
    // Handle project actions
    this.wf.log('arg: ', arg);
    Array.from(projectActions).forEach((executor: Executor) => {
      executor.execute(arg);
    });
  };

  start() {
    this.wf.start();
  }
}
