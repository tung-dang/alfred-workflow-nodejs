import {
  OpenInFinderAction,
  OpenBrowserLink,
  IAction,
  OpenInVSCode,
  OpenInSublimeText
} from '@alfred-wf-node/core';
import { PackageActionArg } from '../types';

export const openInFinderAction = new OpenInFinderAction({
  propertyName: 'localFullPage'
});

export const openDocLink = new OpenBrowserLink({
  propertyName: 'docLink',
  icon: 'icons/bitbucket.jpg',
  name: 'Open document link'
});

export const openInVSCode = new OpenInVSCode({
  propertyName: 'localFullPage'
});

export const openInSublimeAction = new OpenInSublimeText({
  propertyName: 'localFullPage'
});

export const packageActions = [openDocLink, openInVSCode, openInFinderAction, openInSublimeAction];

export const executeActionByKey = (key: string, arg: PackageActionArg) => {
  packageActions.forEach((action: IAction) => {
    if (action.key === key) {
      action.execute(arg);
    }
  });
};
