const fs = require('fs');
const path = require('path');
const { storage } = require('alfred-workflow-nodejs-next');

const git = require('./git-info.js');
const config = require('../config.json');
const sourceFolders = config['source-folders'];
const sources = config['sources'];
const stashServer = config['stash-server'];

const utils = {
    getDirectories: function(folderPath) {
        let rootFolder;
        try {
            rootFolder = fs.readdirSync(folderPath);
            if (rootFolder) {
                const result = rootFolder.filter((file) => {
                    const strChildFolderPath = path.join(folderPath, file);
                    return fs.statSync(strChildFolderPath).isDirectory();
                });

                return result;
            }
        } catch (error) {
            console.info('Can not read folder: ', folderPath, '. Detail error: ', error);
        }

        return [];
    },

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
     * @param path
     * @param callback
     */
    detectProjectInfo: function(path, callback) {
        const keyCache = 'projectsInfo';

        // get from cache
        let projectsInfo = storage.get(keyCache) || {};
        if (projectsInfo[path]) {
            callback(projectsInfo[path]);
            return;
        }

        const projectInfo = {
            projectType: utils.detectProjectType(path)
        };

        utils.detectGitInfo(path, function(gitInfo) {
            projectInfo.gitInfo = gitInfo;
            projectsInfo[path] = projectInfo;

            storage.set(keyCache, projectsInfo);
            callback(projectInfo);
        });
    },

    /**
     * Detect project type of a folder
     * @param  {string} - path path of a folder
     * @return {string} - project type
     */
    detectProjectType: function(path) {
        if (utils.isFileExists(path + '/pom.xml')) {
            return 'java';
        }

        if(utils.isFileExists(path + '/package.json')) {
            return 'nodejs';
        }

        return;
    },

    detectGitInfo: function(path, callback) {
        git.gitInfo(path, function(error, info) {
            callback(info);
        }, stashServer);
    },

    /**
     * Check a file is exist or not
     * @param  {string} filePath - file path
     * @return {boolean} returns true if file is exist or otherwise returns false
     */
    isFileExists: function(filePath) {
        try {
            fs.accessSync(filePath);
            return true;
        } catch (e) {
            return false;
        }

        return false;
    },
};

module.exports = utils;
