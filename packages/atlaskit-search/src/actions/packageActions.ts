import { exec } from 'child_process';
import { PackageAction, PackageActionArg } from '../types';

export const openInFinderAction: PackageAction = {
  key: 'open_in_finder',
  name: 'Open in Finder',
  icon: 'finder.png',
  execute: (arg: PackageActionArg) => {
    const command = `open ${arg.localFullPage}`;
    return exec(command);
  },
  getDesc: (arg: PackageActionArg) => {
    return arg.localFullPage;
  }
};

export const openDocLink: PackageAction = {
  key: 'open_doc_link',
  name: 'Open document link',
  icon: 'bitbucket.jpg',
  execute: (arg: PackageActionArg) => {
    const command = `open ${arg.docLink}`;
    return exec(command);
  },
  getDesc: (arg: PackageActionArg) => {
    return arg.docLink;
  }
};

export const packageActions = [openInFinderAction, openDocLink];

export const executeActionByKey = (key: string, arg: PackageActionArg) => {
  packageActions.forEach((action: PackageAction) => {
    if (action.key === key) {
      action.execute(arg);
    }
  });
};
