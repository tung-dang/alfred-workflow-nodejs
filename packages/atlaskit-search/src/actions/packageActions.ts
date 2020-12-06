import {
  OpenInFinderAction,
  OpenBrowserLinkAction,
  IAction,
  OpenInVSCodeAction,
  OpenInSublimeTextAction
} from '@alfred-wf-node/core';
import { PackageActionArg } from '../types';

export const openInFinderAction = new OpenInFinderAction({
  propertyName: 'localFullPage'
});

export const openDocLink = new OpenBrowserLinkAction({
  propertyName: 'docLink',
  icon: 'icons/bitbucket.jpg',
  name: 'Open document link'
});

export const openRepoLink = new OpenBrowserLinkAction({
  propertyName: 'docLink',
  icon: 'icons/bitbucket.jpg',
  name: 'Open repo link'
});

export const openInVSCode = new OpenInVSCodeAction({
  propertyName: 'localFullPage'
});

export const openInSublimeAction = new OpenInSublimeTextAction({
  propertyName: 'localFullPage'
});

export const packageActions = [
  openDocLink,
  openInVSCode,
  openInFinderAction,
  openInSublimeAction
];

export const executeActionByKey = (key: string, arg: PackageActionArg) => {
  const action = packageActions.find((action: IAction) => {
    if (action.key === key) {
      return action;
    }
  });

  if (action) {
    action.execute(arg);
  } else {
    openRepoLink.execute(arg);
  }
};
