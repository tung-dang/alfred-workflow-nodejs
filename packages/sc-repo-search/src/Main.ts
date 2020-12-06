import { AfWorkflow, storage } from '@alfred-wf-node/core';
import { executeActionByKey } from './actions/project-actions';

const commands = {
  LOAD_PROJECTS: 'loadProjects',
  EXECUTE_AN_ACTION: 'execute_an_action_for_a_project',
  CLEAR_CACHE: 'clear_cache'
};

import LoadProjects from './actions/LoadProjects';
import { ProjectActionArg } from './types';

const pkg = require('../package.json');

export default class MainApp {
  wf: AfWorkflow;

  constructor() {
    this.wf = new AfWorkflow();
    this.wf.setName(pkg.name);

    const loadProjects = new LoadProjects({
      wf: this.wf
    });

    // load projects list
    this.wf.onAction(commands.LOAD_PROJECTS, loadProjects.executeLoadProjects);
    // load project's actions
    this.wf.onSubActionSelected(
      commands.LOAD_PROJECTS,
      loadProjects.executeLoadActionsOfProject
    );

    // execute project action
    this.wf.onAction(commands.EXECUTE_AN_ACTION, this._executeSelectedAction);

    this.wf.onAction(commands.CLEAR_CACHE, () => {
      storage && storage.clear();
    });
  }

  _executeSelectedAction = (query: string) => {
    // Handle project actions

    let arg: ProjectActionArg | null = null;
    if (typeof query === 'string') {
      arg = JSON.parse(query);
    }

    if (arg && arg.actionKey) {
      executeActionByKey(arg.actionKey, arg.actionArg);
    }
  };

  start() {
    this.wf.start();
  }
}
