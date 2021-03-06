import { exec } from 'child_process';
import * as path from 'path';
import AbstractAction from './AbstractAction';
import { IActionOption } from '../types';

export default class OpenInSublimeTextAction extends AbstractAction {
  icon: string;
  key: string;
  name: string;
  propertyName: string;

  constructor(options: IActionOption = {}) {
    super(options);

    this.key = options.key || 'open_in_sublime_text';
    this.name = options.name || 'Open in Sublime Text';
    this.icon =
      options.icon || path.resolve(__dirname, '../../icons/sublime.png');
    this.propertyName = options.propertyName || 'path';
  }

  execute(arg) {
    let command;
    const sublimePath = '/usr/local/bin/subl  --stay';
    if (typeof arg === 'string') {
      command = `${sublimePath} ${arg}`;
    } else {
      command = `${sublimePath} ${this._getPropValueByPropName(arg)}`;
    }
    return exec(command);
  }
}
