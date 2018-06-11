import { ICONS, Item, utils as nodeJSUtils } from '@alfred-wf-node/core';
import executors from '../executors.js';
import { CommandParams } from '../types';

export default class LoadProjectActions {
  workflow: any;

  constructor(options) {
    this.workflow = options.workflow;
  }

  run = (query, arg: CommandParams) => {
    const projectActions = executors;

    const filteredActions = nodeJSUtils.filter(query, projectActions, function(
      projectAction
    ) {
      return projectAction.filterKey
        ? projectAction.filterKey().toLowerCase()
        : '';
    });

    if (filteredActions.length === 0) {
      return;
    }

    const items = [];

    filteredActions.forEach(projectAction => {
      const item = projectAction.build ? projectAction.build(arg) : null;

      if (item) {
        items.push(item);
      }
    });

    this.workflow.addItems(items);
    this.workflow.feedback();
  };
}
