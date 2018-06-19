import { exec } from "child_process";
import { IAction } from './types'

export class OpenInFinderAction implements IAction {
  icon: string;
  key: string;
  name: string;
  propertyName: string;

  constructor(options) {
    this.key  = options.key || 'open_in_finder';
    this.name = options.name || 'Open in Finder';
    this.icon = options.icon || 'finder.png';
    this.propertyName = options.propertyName;
  }

  execute(arg) {
    let command;
    if (typeof arg === 'string') {
      command = `open ${arg}`;
    } else {
      command = `open ${arg[this.propertyName]}`;
    }

    return exec(command);
  }

  getDesc(arg: any): string {
    return arg[this.propertyName];
  }
}
