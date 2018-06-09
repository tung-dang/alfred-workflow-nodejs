import { Item } from 'alfred-workflow-nodejs-next';
import { Executor } from './types';

const DEFAULT_ICON = 'code.png';

export default class ProjectAction implements Executor {
  shortcut: any;
  icon: any;

  constructor(options) {
    this.shortcut = options.shortcut || '';
    this.icon = options.icon || DEFAULT_ICON;
    if (options.getSubTitle) {
      this.getSubTitle = options.getSubTitle;
    }
  }

  shouldDisplay(data) {
    return true;
  }

  build(data) {
    if (this.shouldDisplay(data)) {
      const item = new Item({
        uid: this.name,
        title: this.name,
        subtitle: this.getSubTitle(data),
        icon: 'icons/' + this.icon,
        hasSubItems: false,
        valid: true,

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
}
