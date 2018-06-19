import { OpenInFinderAction, IAction } from "@alfred-wf-node/core";
import { exec } from 'child_process';
import { PackageAction, PackageActionArg } from '../types';

export const openInFinderAction = new OpenInFinderAction({
  propertyName: "localFullPage"
});

export const openDocLink: PackageAction = {
  key: 'open_doc_link',
  name: 'Open document link',
  icon: 'bitbucket.jpg',
  execute: (arg: PackageActionArg | string) => {
    if (typeof arg === 'object') {
      const command = `open ${arg.docLink}`;
      return exec(command);
    }
  },
  getDesc: (arg: PackageActionArg) => {
    return arg.docLink;
  }
};

export const openInVSCode: PackageAction = {
  key: 'open_in_vscode',
  name: 'Open in Visual Studio Code',
  icon: 'vscode.jpg',
  execute: (arg: PackageActionArg | string) => {
    let command;
    const vsCodePath = '/usr/local/bin/code';
    if (typeof arg === 'string') {
      command = `${vsCodePath} ${arg}`;
    } else {
      command = `${vsCodePath} ${arg.localFullPage}`;
    }

    return exec(command);
  }
};

export const packageActions = [
  openDocLink,
  openInVSCode,
  openInFinderAction
];

export const executeActionByKey = (key: string, arg: PackageActionArg) => {
  packageActions.forEach((action: PackageAction | IAction) => {
    if (action.key === key) {
      action.execute(arg);
    }
  });
};
