import * as util from 'util';
// find API of git-utils in https://www.npmjs.com/package/git-utils
import * as git from 'git-utils';
import { GitInfo } from './types';

export const gitInfo = function(
  path: string,
  stashServer: string
): GitInfo | null {
  const repo = git.open(path, false);
  if (!repo) {
    return null;
  }

  const remoteUrl = repo.getConfigValue('remote.origin.url');
  if (!remoteUrl) {
    return null;
  }

  const branch = repo.getShortHead();

  const info: any = _parseGitUrl(remoteUrl, branch, stashServer);
  if (!info) {
    return null;
  }
  info.gitRootPath = repo.getWorkingDirectory();

  return info;
};

// start of private methods
export const _parseGitUrl = function(url, branch, stashServer) {
  var gitConfig = _getBitButketInfo(url, branch);

  if (!gitConfig) {
    gitConfig = _getGithubInfo(url, branch);

    if (!gitConfig && stashServer) {
      gitConfig = _getStashInfo(url, branch, stashServer);
    }
  }

  return gitConfig;
};

export const _getBitButketInfo = function(url, branch) {
  var BITBUCKET_SSH_URL_PATTERN = /git@bitbucket\.org:(.*)\/(.*)\.git/;
  var BITBUCKET_HTTP_URL_PATTERN = /https:\/\/(.*)@bitbucket\.org\/(.*)\/(.*).git/;

  var BITBUCKET_REPO_LINK = 'https://bitbucket.org/%s/%s';
  var BITBUCKET_REPO_PRS_LINK = 'https://bitbucket.org/%s/%s/pull-requests';
  var BITBUCKET_BRANCH_PR_LINK =
    'https://bitbucket.org/%s/%s/pull-requests?query=%s';
  var BITBUCKET_CREATE_PR_LINK =
    'https://bitbucket.org/%s/%s/pull-requests/new?source=%s';

  var project, repo;

  var result = url.match(BITBUCKET_SSH_URL_PATTERN);
  if (result) {
    project = result[1];
    repo = result[2];
  } else {
    result = url.match(BITBUCKET_HTTP_URL_PATTERN);

    if (result) {
      project = result[2];
      repo = result[3];
    }
  }

  if (project && repo) {
    return {
      server: 'bitbucket',
      repo: repo,
      project: project,
      branch: branch,
      url: url,

      link: util.format(BITBUCKET_REPO_LINK, project, repo),
      prsLink: util.format(BITBUCKET_REPO_PRS_LINK, project, repo),
      prLink: util.format(BITBUCKET_BRANCH_PR_LINK, project, repo, branch),
      createPrLink: util.format(BITBUCKET_CREATE_PR_LINK, project, repo, branch)
    };
  }
};

export const _getGithubInfo = function(url, branch) {
  var GITHUB_HTTP_URL_PATTERN = /https:\/\/github\.com\/(.*)\/(.*)\.git/;
  var GITHUB_GIT_URL_PATTERN = /git@github\.com:(.*)\/(.*)\.git/;

  var GITHUB_REPO_LINK = 'https://github.com/%s/%s';
  var GITHUB_REPO_PRS_LINK = 'https://github.com/%s/%s/pulls';
  var GITHUB_BRANCH_PR_LINK = 'https://github.com/%s/%s/pulls?q=';
  var GITHUB_CREATE_PR_LINK = 'https://github.com/%s/%s/compare/%s...master';

  var project, repo;

  var result = url.match(GITHUB_HTTP_URL_PATTERN);
  if (!result) {
    result = url.match(GITHUB_GIT_URL_PATTERN);
  }

  if (result) {
    project = result[1];
    repo = result[2];
    return {
      server: 'github',
      repo: repo,
      project: project,
      branch: branch,
      url: url,

      link: util.format(GITHUB_REPO_LINK, project, repo),
      prsLink: util.format(GITHUB_REPO_PRS_LINK, project, repo),
      prLink: util.format(GITHUB_BRANCH_PR_LINK, project, repo),
      createPrLink: util.format(GITHUB_CREATE_PR_LINK, project, repo, branch)
    };
  }
};

export const _getStashInfo = function(url, branch, stashServer) {
  var STASH_SSH_URL_PATTERN = new RegExp(
    'ssh:\\/\\/git@' + _quote(stashServer) + ':[\\d]*\\/(.*)\\/(.*)\\.git'
  );
  var STASH_HTTP_URL_PATTERN = new RegExp(
    'https:\\/\\/(.*)@' + _quote(stashServer) + '\\/scm\\/(.*)/(.*).git'
  );

  var STASH_REPO_LINK =
    'https://' + stashServer + '/projects/%s/repos/%s/browse';
  var STASH_REPO_PRS_LINK =
    'https://' + stashServer + '/projects/%s/repos/%s/pull-requests';
  var STASH_CREATE_PR_LINK =
    'https://' +
    stashServer +
    '/projects/%s/repos/%s/pull-requests?create&sourceBranch=%s';

  var project, repo;

  var result = url.match(STASH_SSH_URL_PATTERN);
  if (result) {
    project = result[1];
    repo = result[2];
  } else {
    result = url.match(STASH_HTTP_URL_PATTERN);

    if (result) {
      project = result[2];
      repo = result[3];
    }
  }

  if (project && repo) {
    return {
      server: 'stash',
      repo: repo,
      project: project,
      branch: branch,
      url: url,

      link: util.format(STASH_REPO_LINK, project, repo),
      prsLink: util.format(STASH_REPO_PRS_LINK, project, repo),
      prLink: util.format(STASH_REPO_PRS_LINK, project, repo),
      createPrLink: util.format(STASH_CREATE_PR_LINK, project, repo, branch)
    };
  }
};

export const _quote = function(str) {
  return str.replace(/(?=[\/\\^$*+?.()|{}[\]])/g, '\\');
};
