import { Item, IAction } from '@alfred-wf-node/core';
import { CommandParams, ProjectActionArg } from '../types';

const DEFAULT_ICON = 'code.png';

export default class ProjectAction implements IAction {
  shortcut: any;
  icon: any;
  key: string;
  name: string;
  execute: (arg: any) => void;

  constructor(options) {
    this.key = options.key;
    this.name = options.name;
    this.execute = options.execute ? options.execute.bind(this) : undefined;

    this.shortcut = options.shortcut || '';
    this.icon = options.icon || DEFAULT_ICON;
  }

  shouldDisplay(data?: any) {
    console.debug('==================', data);
    return true;
  }

  build(argItem: CommandParams) {
    const arg: ProjectActionArg = {
      actionKey: this.key,
      actionArg: argItem
    };

    return new Item({
      uid: this.name,
      title: this.name,
      subtitle: this.getSubTitle(argItem),
      icon: 'icons/' + this.icon,
      // arg will be passed to hanlder of `commands.EXECUTE`
      arg,

      valid: this.shouldDisplay(argItem)
    });
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
}
