import { exec } from 'child_process';
import { utils } from '@alfred-wf-node/core';

import ProjectAction from './ProjectAction';
import ProjectGitAction from './project-git-action';
import { Executor } from './types';

export const openInFinderAction = new ProjectAction({
  key: 'open_in_finder',
  name: 'Open in Finder',
  icon: 'finder.png',
  executor: data => {
    const command = `open ${data.path}`;
    return exec(command);
  }
});

export const openInItermAction = new ProjectAction({
  name: 'Open in Iterm',
  icon: 'iterm.png',
  executor: data => {
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
  executor: data => {
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
  executor: data => {
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
  executor: arg => {
    const command = `/usr/local/bin/subl --stay ${arg.path}`;
    return exec(command);
  }
});

export const openInIDEA = new ProjectAction({
  key: 'open_in_idea',
  name: 'Open in IntelliJ IDEA',
  icon: 'idea.png',
  executor: data => {
    const command = `/usr/local/bin/idea ${data.path}`;
    return exec(command);
  }
});

export const openInWebStorm = new ProjectAction({
  name: 'Open in WebStorm',
  icon: 'wstorm.icns',
  executor: data => exec(`./bin/wstorm ${data.path}`)
});

export const openInVSCode = new ProjectAction({
  key: 'open_in_vscode',
  name: 'Open in Visual Studio Code',
  icon: 'vscode.jpg',
  executor: data => {
    const command = `/usr/local/bin/code ${data.path}`;
    return exec(command);
  }
});

export const openInSourceTree = new ProjectGitAction({
  key: 'open_in_source_tree',
  name: 'Open in Source Tree',
  shortcut: 'st',
  icon: 'sourcetree.png',
  executor: data => {
    const command = `open -a SourceTree ${data.path}`;
    return exec(command);
  },
  getIcon: data => {
    return this.icon;
  }
});

export const openRepoLink = new ProjectGitAction({
  key: 'open_repo_link',
  name: 'Open Repo Link',
  shortcut: 'repo',
  executor: data => {
    const command = `open ${data.gitInfo.link}`;
    return exec(command);
  },
  getSubTitle: data => data.gitInfo.link
});

export const createPullRequest = new ProjectGitAction({
  name: 'Create Pull Request',
  shortcut: 'cpr',
  executor: data => {
    const info = data.gitInfo;
    exec(`open ${info.createPrLink}`);
  }
});

createPullRequest.getSubTitle = data => data.gitInfo.createPrLink;

export const openPullRequests = new ProjectGitAction({
  name: 'Open Pull Requests',
  shortcut: 'prs',
  executor: data => {
    const info = data.gitInfo;
    exec(`open ${info.prsLink}`);
  }
});

openPullRequests.getSubTitle = data => data.gitInfo.prsLink;

// end of git actions

// Open config file action
export const openConfigFileAction: Executor = {
  key: 'open_config_file',
  name: 'Open Config File',
  execute: arg => exec('open config.json')
};

const executors = [
  openInFinderAction,
  openInVSCode,
  openInItermAction,
  openInItermCurrentSessionAction,
  openInNewItermSplitPanelAction,
  openInSublimeAction,
  openInIDEA,
  openInWebStorm,
  openInSourceTree,
  openRepoLink,
  createPullRequest,
  openPullRequests,
  openConfigFileAction
];

export default executors;
