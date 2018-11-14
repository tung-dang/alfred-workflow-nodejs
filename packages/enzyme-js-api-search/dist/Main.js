"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@alfred-wf-node/core");
const github = require("octonode");
exports.openLink = new core_1.OpenBrowserLink({
    propertyName: 'link'
});
const REPO = 'airbnb/enzyme';
const API_PATH = 'docs/api';
const BRANCH = 'master';
const WEBSITE_CLI = 'http://airbnb.io/enzyme/docs/api/';
const client = github.client();
const githubRepo = client.repo(REPO);
const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_WEEK = ONE_DAY * 7;
const ONE_MONTH = ONE_WEEK * 4;
const commands = {
    LOAD_ALL_LINKS: 'load_all_links',
    OPEN_LINK: 'open_link',
    CLEAR_CACHE: 'clear_cache'
};
const pkg = require('../package.json');
class MainApp {
    constructor() {
        this.workflow = new core_1.AfWorkflow();
        this.workflow.setName(pkg.name);
        this.workflow.onAction(commands.LOAD_ALL_LINKS, query => this._loadAllLinks(query));
        this.workflow.onAction(commands.CLEAR_CACHE, () => core_1.storage.clear());
        this.workflow.onAction(commands.OPEN_LINK, arg => {
            if (typeof arg === 'string') {
                exports.openLink.execute(JSON.parse(arg));
            }
            else {
                exports.openLink.execute(arg);
            }
        });
    }
    _fetchFolder(url = API_PATH) {
        const promise = new Promise(resolve => {
            const fetchedItems = [];
            githubRepo.contents(url, BRANCH, (error, res) => {
                if (error) {
                    throw new Error('can not get fetch folders');
                }
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
        const dataFromCache = core_1.storage.get('cache_links');
        if (dataFromCache) {
            console.warn('Get data from cache...');
            this._generateFeedback(dataFromCache, query);
            return;
        }
        console.warn('Start fetching...');
        const rootFolderPromise = this._fetchFolder(API_PATH);
        const folder1stPromise = this._fetchFolder(API_PATH + '/ReactWrapper');
        const folder2ndPromise = this._fetchFolder(API_PATH + '/ShallowWrapper');
        Promise.all([rootFolderPromise, folder1stPromise, folder2ndPromise]).then(results => {
            let files = [];
            results.forEach((items) => {
                files = files.concat(items);
            });
            core_1.storage.set('cache_links', files, ONE_MONTH);
            this._generateFeedback(files, query);
        });
    }
    _generateFeedback(response, query) {
        const items = [];
        response.forEach(item => {
            let cliName = item.name;
            cliName = cliName.replace('.md', '');
            const url = item.html_url;
            const path = item.path.replace('docs/api/', '').replace('.md', '.html');
            const urlWebsite = WEBSITE_CLI + path;
            items.push(new core_1.AfItem({
                uid: url,
                title: cliName,
                subtitle: urlWebsite,
                arg: {
                    actionName: 'open_link',
                    link: urlWebsite
                },
                mods: {
                    cmd: {
                        arg: {
                            actionName: 'open_link',
                            link: url
                        },
                        subtitle: url
                    }
                }
            }));
        });
        const filteredItems = core_1.utils.filter(query, items, item => item.get('title'));
        this.workflow.addItems(filteredItems);
        this.workflow.feedback();
    }
    start() {
        this.workflow.start();
    }
}
exports.default = MainApp;
