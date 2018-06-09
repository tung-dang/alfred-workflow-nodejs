const exec = require('child_process').exec;
const fs = require('fs');
const utils = require('util');

/**
 * path
 * callback(error, gitInfo)
 * stashServer
 */
const gitInfo = function(path, callback, stashServer) {
    const command = 'cd ' + path + ' && git config --get remote.origin.url'
    exec(command, function(error, stdout, stderr) {
        if (error || !stdout) {
            callback('git config: not a git repo');
            return;
        }

        const url = stdout.trim();

        // get branch
        gitBranch(function(error, branch) {
            if (error) {
                callback(error);
                return;
            }

            // get repo info
            const info = _parseGitUrl(url, branch, stashServer);
            if (!info) {
                callback(error);
                return;
            }

            // get git root path
            gitRootPath(function(error, gitRootPath) {
                if (error) {
                    callback(error);
                    return;
                }
                info.gitRootPath = gitRootPath;
                callback(undefined, info);
            })

        })

    });
}

/**
 * callback(error, branch)
 */
const gitBranch = function(callback) {
    exec('git rev-parse --abbrev-ref HEAD', function(error, stdout, stderr) {
        if (error || !stdout) {
            callback('gitBranch: not a git repo');
            return;
        }
        callback(undefined, stdout.trim());
    });
}

/**
 * callback(error, branch)
 */
var gitRootPath = function(callback) {
    exec('git rev-parse --show-toplevel', function(error, stdout, stderr) {
        if (error || !stdout) {
            callback('gitRootPath: not a git repo');
            return;
        }
        callback(undefined, stdout.trim());
    });
}

// start of private methods
var _parseGitUrl = function(url, branch, stashServer) {
    var gitConfig = _getBitButketInfo(url, branch);

    if (!gitConfig) {
        gitConfig = _getGithubInfo(url, branch);

        if (!gitConfig && stashServer) {
            gitConfig = _getStashInfo(url, branch, stashServer);
        }
    }

    return gitConfig;
}

var _getBitButketInfo = function(url, branch) {
    var BITBUCKET_SSH_URL_PATTERN = /git@bitbucket\.org:(.*)\/(.*)\.git/
    var BITBUCKET_HTTP_URL_PATTERN = /https:\/\/(.*)@bitbucket\.org\/(.*)\/(.*).git/

    var BITBUCKET_REPO_LINK = 'https://bitbucket.org/%s/%s'
    var BITBUCKET_REPO_PRS_LINK = 'https://bitbucket.org/%s/%s/pull-requests'
    var BITBUCKET_BRANCH_PR_LINK = 'https://bitbucket.org/%s/%s/pull-requests?query=%s'
    var BITBUCKET_CREATE_PR_LINK = 'https://bitbucket.org/%s/%s/pull-requests/new?source=%s'

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

            link: utils.format(BITBUCKET_REPO_LINK, project, repo),
            prsLink: utils.format(BITBUCKET_REPO_PRS_LINK, project, repo),
            prLink: utils.format(BITBUCKET_BRANCH_PR_LINK, project, repo, branch),
            createPrLink: utils.format(BITBUCKET_CREATE_PR_LINK, project, repo, branch)
        }
    }
}

var _getGithubInfo = function(url, branch) {
    var GITHUB_HTTP_URL_PATTERN = /https:\/\/github\.com\/(.*)\/(.*)\.git/
    var GITHUB_GIT_URL_PATTERN = /git@github\.com:(.*)\/(.*)\.git/

    var GITHUB_REPO_LINK = 'https://github.com/%s/%s'
    var GITHUB_REPO_PRS_LINK = 'https://github.com/%s/%s/pulls'
    var GITHUB_BRANCH_PR_LINK = 'https://github.com/%s/%s/pulls?q='
    var GITHUB_CREATE_PR_LINK = 'https://github.com/%s/%s/compare/%s...master'

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

            link: utils.format(GITHUB_REPO_LINK, project, repo),
            prsLink: utils.format(GITHUB_REPO_PRS_LINK, project, repo),
            prLink: utils.format(GITHUB_BRANCH_PR_LINK, project, repo),
            createPrLink: utils.format(GITHUB_CREATE_PR_LINK, project, repo, branch)
        }
    }
}

var _getStashInfo = function(url, branch, stashServer) {

    var STASH_SSH_URL_PATTERN = new RegExp("ssh:\\/\\/git@" + _quote(stashServer) + ":[\\d]*\\/(.*)\\/(.*)\\.git");
    var STASH_HTTP_URL_PATTERN = new RegExp("https:\\/\\/(.*)@" + _quote(stashServer) + "\\/scm\\/(.*)/(.*).git");

    var STASH_REPO_LINK = 'https://' + stashServer + '/projects/%s/repos/%s/browse'
    var STASH_REPO_PRS_LINK = 'https://' + stashServer + '/projects/%s/repos/%s/pull-requests'
    var STASH_CREATE_PR_LINK = 'https://' + stashServer + '/projects/%s/repos/%s/pull-requests?create&sourceBranch=%s'

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

            link: utils.format(STASH_REPO_LINK, project, repo),
            prsLink: utils.format(STASH_REPO_PRS_LINK, project, repo),
            prLink: utils.format(STASH_REPO_PRS_LINK, project, repo),
            createPrLink: utils.format(STASH_CREATE_PR_LINK, project, repo, branch)
        }
    }
}

function _quote(str) {
    return str.replace(/(?=[\/\\^$*+?.()|{}[\]])/g, "\\");
}

/**
 * Exports
 */
module.exports = {
    gitInfo: gitInfo,
    gitBranch: gitBranch,
    // for testing
    test: {
        _getBitButketInfo: _getBitButketInfo,
        _getGithubInfo: _getGithubInfo,
        _getStashInfo: _getStashInfo
    }
}