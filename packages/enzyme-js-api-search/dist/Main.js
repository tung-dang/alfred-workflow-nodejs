"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const alfred_workflow_nodejs_next_1 = require("alfred-workflow-nodejs-next");
const executors_js_1 = require("./executors.js");
const REPO = 'airbnb/enzyme';
const API_PATH = 'docs/api';
const BRANCH = 'master';
const WEBSITE_CLI = 'http://airbnb.io/enzyme/docs/api/';
const github = require("octonode");
const client = github.client();
const githubRepo = client.repo(REPO);
const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_WEEK = ONE_DAY * 7;
const commands = {
    LOAD_ALL_LINKS: 'load_all_links',
    OPEN_LINK: 'open_link',
    CLEAR_CACHE: 'clear_cache'
};
class MainApp {
    constructor() {
        this.workflow = new alfred_workflow_nodejs_next_1.Workflow({
            // change isDebug=true to prevent caching and show logs only
            isDebug: false
        });
        this.workflow.setName('alfred-wf-yarn-api-search');
        this.workflow.onAction(commands.LOAD_ALL_LINKS, query => this._loadAllLinks(query));
        this.workflow.onAction(commands.CLEAR_CACHE, () => alfred_workflow_nodejs_next_1.storage.clear());
        this.workflow.onAction(commands.OPEN_LINK, arg => {
            if (typeof arg === 'string') {
                executors_js_1.openLinkExecutor.execute(JSON.parse(arg));
            }
            else {
                executors_js_1.openLinkExecutor.execute(arg);
            }
        });
    }
    _fetchFolder(url = API_PATH) {
        const promise = new Promise(resolve => {
            const fetchedItems = [];
            githubRepo.contents(url, BRANCH, (error, res) => {
                if (res && res.length > 0) {
                    res.forEach(item => {
                        if (item.type === 'file' && !item.name.includes('README')) {
                            fetchedItems.push(item);
                        }
                    });
                    resolve(fetchedItems);
                }
            });
        });
        return promise;
    }
    _loadAllLinks(query) {
        if (!this.workflow.isDebug) {
            const dataFromCache = alfred_workflow_nodejs_next_1.storage.get('cache_links');
            if (dataFromCache) {
                console.warn('Get data from cache...');
                this._generateFeedback(dataFromCache, query);
                return;
            }
        }
        console.warn('Start fetching...');
        const rootFolderPromise = this._fetchFolder(API_PATH);
        const folder1stPromise = this._fetchFolder(API_PATH + '/ReactWrapper');
        const folder2ndPromise = this._fetchFolder(API_PATH + '/ShallowWrapper');
        Promise.all([rootFolderPromise, folder1stPromise, folder2ndPromise]).then(results => {
            let files = [];
            results.forEach(function (items) {
                files = files.concat(items);
            });
            alfred_workflow_nodejs_next_1.storage.set('cache_links', files, ONE_WEEK);
            this._generateFeedback(files, query);
        });
    }
    _generateFeedback(response, query) {
        const items = [];
        response.forEach(item => {
            let cliName = item.name;
            cliName = cliName.replace('.md', '');
            const url = item.html_url;
            const path = item.path
                .replace('docs/api/', '')
                .replace('.md', '.html');
            const urlWebsite = WEBSITE_CLI + path;
            items.push(new alfred_workflow_nodejs_next_1.Item({
                uid: url,
                title: cliName,
                subtitle: urlWebsite,
                valid: true,
                hasSubItems: false,
                arg: {
                    // Default: open Yarn website link
                    actionName: 'open_link',
                    link: urlWebsite
                },
                mods: {
                    // if users press CMD, open GitHub link
                    cmd: {
                        valid: true,
                        arg: {
                            actionName: 'open_link',
                            link: url
                        },
                        subtitle: url
                    }
                }
            }));
        });
        const filteredItems = alfred_workflow_nodejs_next_1.utils.filter(query, items, item => item.get('title'));
        this.workflow.addItems(filteredItems);
        this.workflow.feedback();
    }
    start() {
        this.workflow.start();
    }
}
exports.default = MainApp;
