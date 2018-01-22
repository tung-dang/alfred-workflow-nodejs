const { Workflow, Item, storage, utils } = require('alfred-workflow-nodejs-next');
const { openLinkExecutor } = require('./executors.js');

const REPO = 'airbnb/enzyme';
const API_PATH = 'docs/api';
const BRANCH = 'master';
const WEBSITE_CLI = 'http://airbnb.io/enzyme/docs/api/';

const github = require('octonode');
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

(function initWorkflow() {
    const workflow = new Workflow({
        // change isDebug=true to prevent caching and show logs only
        isDebug: false
    });
    workflow.setName('alfred-wf-yarn-api-search');

    workflow.onAction(commands.LOAD_ALL_LINKS, (query) => loadAllLinks(workflow, query));
    workflow.onAction(commands.CLEAR_CACHE, () => storage.clear());

    workflow.onAction(commands.OPEN_LINK, (arg) => {
        if (typeof arg === 'string') {
            openLinkExecutor.execute(JSON.parse(arg));
        } else {
            openLinkExecutor.execute(arg);
        }
    });

    workflow.start();
}());


function fetchFolder(url = API_PATH) {
    const promise = new Promise((resolve) => {
        const fetchedItems = [];

        githubRepo.contents(url, BRANCH, (error, res) => {
            if (res && res.length > 0) {
                res.forEach((item) => {
                    if (item.type === 'file' &&
                        !item.name.includes('README')) {
                        fetchedItems.push(item);
                    }
                });

                resolve(fetchedItems);
            }
        });
    });

    return promise;
}

function loadAllLinks(workflow, query) {
    if (!workflow.isDebug) {
        const dataFromCache = storage.get('cache_links');
        if (dataFromCache) {
            console.warn('Get data from cache...');
            generateFeedback(dataFromCache, query, workflow);
            return;
        }
    }

    console.warn('Start fetching...');

    const rootFolderPromise = fetchFolder(API_PATH);
    const folder1stPromise = fetchFolder(API_PATH + '/ReactWrapper');
    const folder2ndPromise = fetchFolder(API_PATH + '/ShallowWrapper');
    Promise.all([rootFolderPromise, folder1stPromise, folder2ndPromise])
        .then((results) => {
            let files = [];
            results.forEach(function (items) {
                files = files.concat(items);
            });

            storage.set('cache_links', files, ONE_WEEK);
            generateFeedback(files, query, workflow);
        });
}

function generateFeedback(response, query, workflow) {
    const items = [];

    response.forEach((item) => {
        let cliName = item.name;
        cliName = cliName.replace('.md', '');
        const url = item.html_url;

        const path = item.path
                            .replace('docs/api/', '')
                            .replace('.md', '.html');
        const urlWebsite = WEBSITE_CLI + path;

        items.push(new Item({
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

    const filteredItems = utils.filter(query, items, (item) => item.get('title'));

    workflow.addItems(filteredItems);
    workflow.feedback();
}