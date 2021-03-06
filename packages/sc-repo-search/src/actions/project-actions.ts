import {
  utils,
  OpenInFinderAction,
  OpenBrowserLinkAction,
  OpenInVSCodeAction,
  OpenInSublimeTextAction
} from '@alfred-wf-node/core';
import { exec } from 'child_process';

import ProjectAction from './ProjectAction';
// import ProjectGitAction from './project-git-action';
import { CommandParams } from '../types';

export const openInFinderAction = new OpenInFinderAction({
  propertyName: 'path'
});

export const openRepoLink = new OpenBrowserLinkAction({
  key: 'open_repo_link',
  name: 'Open Repo Link',
  propertyName: 'gitInfo.link'
});

export const openPullRequests = new OpenBrowserLinkAction({
  key: 'open_pull_request',
  name: 'Open Pull Requests',
  propertyName: 'gitInfo.prsLink'
});

export const createPullRequest = new OpenBrowserLinkAction({
  key: 'create_pull_request',
  name: 'Create Pull Request',
  propertyName: 'gitInfo.createPrLink'
});

export const openInVSCode = new OpenInVSCodeAction({
  propertyName: 'path'
});

export const openInSublimeAction = new OpenInSublimeTextAction({
  propertyName: 'path'
});

export const openInItermAction = new ProjectAction({
  key: 'open_in_iterm',
  name: 'Open in Iterm',
  icon: 'iterm.png',
  execute: (data: CommandParams) => {
    const OPEN_IN_ITERM_AS =
      'tell application "iTerm"\n' +
      'activate\n' +
      'tell current window\n' +
      'set newTab to (create tab with default profile)\n' +
      'tell last session of newTab\n' +
      'write text "cd " & quoted form of "%s"\n' +
      'end tell\n' +
      'end tell\n' +
      'end tell\n';
    const script = OPEN_IN_ITERM_AS.replace('%s', data.path);
    // @ts-ignore
    utils.applescript.execute(script);
  }
});

export const openInNewItermSplitPanelAction = new ProjectAction({
  key: 'open_in_iterm_at_new_split_panel',
  name: 'Open in Iterm in new split panel',
  icon: 'iterm.png',
  execute: (data: CommandParams) => {
    const OPEN_IN_ITERM_NEW_SPLIT_PANEL_AS =
      'tell application "iTerm"\n' +
      'activate\n' +
      'tell current window\n' +
      'tell current session\n' +
      'set newSession to (split horizontally with default profile)\n' +
      'tell newSession\n' +
      'write text "cd " & quoted form of "%s"\n' +
      'end tell\n' +
      'end tell\n' +
      'end tell\n' +
      'end tell\n';

    const script = OPEN_IN_ITERM_NEW_SPLIT_PANEL_AS.replace('%s', data.path);

    // @ts-ignore
    utils.applescript.execute(script);
  }
});

export const openInItermCurrentSessionAction = new ProjectAction({
  key: 'open_in_iterm_at_current_tab',
  name: 'Open in Iterm at current tab',
  icon: 'iterm.png',
  execute: (data: CommandParams) => {
    const OPEN_IN_ITERM_CURRENT_SESSION_AS =
      'tell application "iTerm"\n' +
      'activate\n' +
      'tell current window\n' +
      'tell current session\n' +
      'write text "cd " & quoted form of "%s"\n' +
      'end tell\n' +
      'end tell\n' +
      'end tell\n';

    const script = OPEN_IN_ITERM_CURRENT_SESSION_AS.replace('%s', data.path);
    // @ts-ignore
    utils.applescript.execute(script);
  }
});

export const openInIDEA = new ProjectAction({
  key: 'open_in_idea',
  name: 'Open in IntelliJ IDEA',
  icon: 'idea.png',
  execute: (data: CommandParams) => {
    const command = `/usr/local/bin/idea ${data.path}`;
    return exec(command);
  }
});

export const openInWebStorm = new ProjectAction({
  key: 'open_in_webstorm',
  name: 'Open in WebStorm',
  icon: 'wstorm.icns',
  execute: (data: CommandParams) => {
    return exec(`./bin/wstorm ${data.path}`);
  }
});

export const openInSourceTree = new ProjectAction({
  key: 'open_in_source_tree',
  name: 'Open in Source Tree',
  shortcut: 'st',
  icon: 'sourcetree.png',
  execute: (data: CommandParams) => {
    const command = `open -a SourceTree ${data.path}`;
    return exec(command);
  },
  getIcon: (/*data*/) => {
    // @ts-ignore
    return this.icon;
  }
});

// end of git actions
export const projectActions = [
  openInFinderAction,
  openPullRequests,
  openRepoLink,
  createPullRequest,
  openInVSCode,

  openInItermAction,
  openInItermCurrentSessionAction,
  openInNewItermSplitPanelAction,
  openInSublimeAction,
  openInIDEA,
  openInWebStorm,
  openInSourceTree
];

export const executeActionByKey = (
  actionKey: string,
  actionArg: CommandParams
) => {
  // @ts-ignore
  projectActions.forEach((action: ProjectAction) => {
    if (action.key === actionKey || action.name === actionKey) {
      action.execute(actionArg);
    }
  });
};
