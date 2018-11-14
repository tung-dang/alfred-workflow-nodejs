import * as path from 'path';
import * as clipboardy from 'clipboardy';
import AbstractAction from './AbstractAction';
import { IActionOption } from '../types';

export default class CopyToClipboardAction extends AbstractAction {
  icon: string;
  key: string;
  name: string;
  propertyName: string;

  constructor(options: IActionOption = {}) {
    super(options);

    this.key = options.key || 'copy_to_clipboard';
    this.name = options.name || 'Copy link to clipboard';
    this.icon =
      options.icon || path.resolve(__dirname, '../../icons/copy.png');
    this.propertyName = options.propertyName || 'link';
  }

  execute(arg) {
    clipboardy.writeSync(typeof arg === 'string'
      ? arg
      : this._getPropValueByPropName(arg)
    );
  }
}
