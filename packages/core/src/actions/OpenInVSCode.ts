import { exec } from 'child_process';
import * as path from 'path';
import AbstractAction from './AbstractAction';

export default class OpenInVSCode extends AbstractAction {
  icon: string;
  key: string;
  name: string;
  propertyName: string;

  constructor(options) {
    super(options);

    this.key = options.key || 'open_in_vscode';
    this.name = options.name || 'Open in Visual Studio Code';
    this.icon =
      options.icon || path.resolve(__dirname, '../../icons/vscode.jpg');
    this.propertyName = options.propertyName;
  }

  execute(arg) {
    let command;
    const vsCodePath = '/usr/local/bin/code';
    const vsCodeOptions = '--new-window';
    if (typeof arg === 'string') {
      command = `${vsCodePath} ${vsCodeOptions} ${arg}`;
    } else {
      command = `${vsCodePath} ${vsCodeOptions} ${this._getPropValueByPropName(arg)}`;
    }

    return exec(command);
  }
}
