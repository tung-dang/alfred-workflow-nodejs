import { exec } from 'child_process';
import * as path from 'path';
import AbstractAction from './AbstractAction';
import { IActionOption } from '../types';

export default class OpenBrowserLinkAction extends AbstractAction {
  icon: string;
  key: string;
  name: string;
  propertyName: string;

  constructor(options: IActionOption = {}) {
    super(options);

    this.key = options.key || 'open_browser_link';
    this.name = options.name || 'Open link in browser';
    this.icon =
      options.icon || path.resolve(__dirname, '../../icons/chrome.png');
    this.propertyName = options.propertyName || 'link';
  }

  execute(arg: any) {
    let command;
    if (typeof arg === 'string') {
      command = `open ${arg}`;
    } else {
      command = `open ${this._getPropValueByPropName(arg)}`;
    }

    return exec(command);
  }
}
