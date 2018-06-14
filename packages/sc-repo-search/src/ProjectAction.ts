import { Item } from '@alfred-wf-node/core';
import { CommandParams, Executor } from './types';

const DEFAULT_ICON = 'code.png';

export default class ProjectAction implements Executor {
  shortcut: any;
  icon: any;
  key: string;
  name: string;
  executor: (args: any) => void;

  constructor(options) {
    this.key = options.key;
    this.name = options.name;
    this.executor = options.execute;

    this.shortcut = options.shortcut || '';
    this.icon = options.icon || DEFAULT_ICON;
  }

  shouldDisplay(data?: any) {
    console.debug('==================', data);
    return true;
  }

  build(data) {
    if (this.shouldDisplay(data)) {
      const item = new Item({
        uid: this.name,
        title: this.name,
        subtitle: this.getSubTitle(data),
        icon: 'icons/' + this.icon,

        // arg will be passed to hanlder of `commands.EXECUTE`
        arg: JSON.stringify({
          actionName: this.name,
          actionKey: this.key,
          path: data.path,
          gitInfo: data.gitInfo
        })
      });

      return item;
    }
  }

  /**
   * When creating new instance, consumer can pass a overridden of `getSubTitle` method.
   * @param data
   * @returns {*|string}
   */
  getSubTitle(data) {
    return data.path;
  }

  filterKey() {
    return `${this.name}${this.shortcut ? ' ' + this.shortcut : ''}`;
  }

  execute(arg: CommandParams) {
    arg = typeof arg === 'string' ? JSON.parse(arg) : arg;

    if (
      (this.name !== undefined && this.name === arg.actionName) ||
      (this.key !== undefined && this.key === arg.actionKey)
    ) {
      this.executor(arg);
    }
  }
}
