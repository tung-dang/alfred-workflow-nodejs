import * as fs from 'fs';
import * as path from 'path';
import { storage } from '@alfred-wf-node/core';

import * as git from './git-info.js';
import { ProjectInfo, GitInfo, ProjectType } from './types.js';

export function getDirectories(folderPath: string): string[] {
  let rootFolder;

  try {
    rootFolder = fs.readdirSync(folderPath);
    if (rootFolder) {
      const result = rootFolder.filter(file => {
        const strChildFolderPath = path.join(folderPath, file);
        return fs.statSync(strChildFolderPath).isDirectory();
      });

      return result;
    }
  } catch (error) {
    console.info(
      'Can not read folder: ',
      folderPath,
      '. Detail error: ',
      error
    );
  }

  return [];
}

/**
 * Here is example of project info which is returned in callback
 * projectsInfo: {
 *      projectType: 'nodejs',
 *      gitInfo: {
 *          server: 'bitbucket',
 *          repo: 'jira-browser-metrics-enhancements',
 *          project: 'jgeeves',
 *          branch: 'master',
 *          url: 'git@bitbucket.org:jgeeves/jira-browser-metrics-enhancements.git',
 *          link: 'https://bitbucket.org/jgeeves/jira-browser-metrics-enhancements',
 *          prsLink: 'https://bitbucket.org/jgeeves/jira-browser-metrics-enhancements/pull-requests',
 *          prLink: 'https://bitbucket.org/jgeeves/jira-browser-metrics-enhancements/pull-requests?query=master',
 *          createPrLink: 'https://bitbucket.org/jgeeves/jira-browser-metrics-enhancements/pull-requests/new?source=master',
 *          gitRootPath: '/Users/tthanhdang/src/_tools/alfred-workflows/workflows/alfred-source-code-workflow'
 *          }
 * }
 */
export function getProjectInfo(path: string, stashServerURL: string) {
  const keyCache = 'projectsInfo';

  // get from cache
  const projects: { [path: string]: ProjectInfo } = storage.get(keyCache) || {};
  if (projects[path]) {
    return projects[path];
  }

  // construct a new object
  const projectType = getProjectType(path);
  if (!projectType) {
    return null;
  }

  const pInfo: ProjectInfo = {
    projectType,
    gitInfo: getGitInfo(path, stashServerURL) as GitInfo
  };

  projects[path] = pInfo;
  storage.set(keyCache, projects);
  return pInfo;
}

/**
 * Detect project type of a folder
 */
export function getProjectType(path: string): ProjectType | null {
  if (isFileExists(path + '/pom.xml')) {
    return 'java';
  }

  if (isFileExists(path + '/package.json')) {
    return 'nodejs';
  }

  return null;
}

export function getGitInfo(path, stashServer): GitInfo | null {
  return git.gitInfo(path, stashServer);
}

/**
 * Check a file is exist or not
 */
export function isFileExists(filePath: string): boolean {
  try {
    fs.accessSync(filePath);
    return true;
  } catch (e) {
    return false;
  }
}
