import {
  Workflow,
  Item,
  ICONS,
  storage,
  settings
} from 'alfred-workflow-nodejs-next';
import * as executors from './executors.js';

const commands = {
  LOAD_PROJECTS: 'loadProjects',
  EXECUTE: 'execute',
  CLEAR_CACHE: 'clear_cache'
};

import LoadProjects from './load-projects';
import LoadProjectAction from './load-project-actions';

export default class MainApp {
  workflow: Workflow;

  constructor() {
    this.workflow = new Workflow();
    this.workflow.setName('alfred-source-code-wf');

    const loadProjects = new LoadProjects({
      workflow: this.workflow
    });
    const loadProjectAction = new LoadProjectAction({
      workflow: this.workflow
    });

    // load projects list
    this.workflow.onAction(commands.LOAD_PROJECTS, query => {
      loadProjects.run(query);
    });
    // load project's actions
    this.workflow.onSubActionSelected(
      commands.LOAD_PROJECTS,
      (query, previousSelectedTitle, previousSelectedArg) => {
        loadProjectAction.run(query, previousSelectedArg);
      }
    );

    // execute project action
    this.workflow.onAction(commands.EXECUTE, function(arg) {
      // Handle project actions
      executors.forEach(executor => {
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
