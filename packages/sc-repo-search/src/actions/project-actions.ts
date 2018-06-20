import {
  utils,
  OpenInFinderAction,
  OpenBrowserLink,
  OpenInVSCode
} from '@alfred-wf-node/core';
import { exec } from 'child_process';

import ProjectAction from './ProjectAction';
// import ProjectGitAction from './project-git-action';
import { CommandParams } from '../types';

export const openInFinderAction = new OpenInFinderAction({
  propertyName: 'path'
});

export const openRepoLink = new OpenBrowserLink({
  key: 'open_repo_link',
  name: 'Open Repo Link',
  propertyName: 'gitInfo.link'
});

export const openPullRequests = new OpenBrowserLink({
  key: 'open_pull_request',
  name: 'Open Pull Requests',
  propertyName: 'gitInfo.prsLink'
});

export const createPullRequest = new OpenBrowserLink({
  key: 'create_pull_request',
  name: 'Create Pull Request',
  propertyName: 'gitInfo.createPrLink'
});

export const openInItermAction = new ProjectAction({
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
    utils.applescript.execute(script);
  }
});

export const openInNewItermSplitPanelAction = new ProjectAction({
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
    utils.applescript.execute(script);
  }
});

export const openInItermCurrentSessionAction = new ProjectAction({
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
    utils.applescript.execute(script);
  }
});

export const openInSublimeAction = new ProjectAction({
  key: 'open_in_sublime',
  name: 'Open in Sublime',
  icon: 'sublime.png',
  execute: (arg: CommandParams) => {
    const command = `/usr/local/bin/subl --stay ${arg.path}`;
    return exec(command);
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
  name: 'Open in WebStorm',
  icon: 'wstorm.icns',
  execute: (data: CommandParams) => exec(`./bin/wstorm ${data.path}`)
});

export const openInVSCode = new OpenInVSCode({});

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
  projectActions.forEach((action: ProjectAction) => {
    if (action.key === actionKey) {
      action.execute(actionArg);
    }
  });
};
