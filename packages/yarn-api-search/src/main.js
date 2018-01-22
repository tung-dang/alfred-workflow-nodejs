const { Workflow, Item, storage, utils } = require('alfred-workflow-nodejs-next');
const { openLinkExecutor } = require('./executors.js');

const YARN_REPO = 'yarnpkg/website';
const YARN_API_PATH = 'lang/en/docs/cli';
const BRANCH = 'master';
const YARN_WEBSITE_CLI = 'https://yarnpkg.com/en/docs/cli/';

const github = require('octonode');
const client = github.client();
const ghrepo = client.repo(YARN_REPO);

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
    const workflow = new Workflow();
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

function loadAllLinks(workflow, query) {
    const dataFromCache = storage.get('cache_links');
    if (dataFromCache) {
        console.warn('Get data from cache...');
        generateFeedback(dataFromCache, query, workflow);
        return;
    }

    console.warn('Start fetching...');
    ghrepo.contents(YARN_API_PATH, BRANCH, (error, res) => {
        if (error) {
            console.warn('Can not fetch file list', error);
            return;
        }

        storage.set('cache_links', res, ONE_WEEK);
        generateFeedback(res, query, workflow);
    });
}

function generateFeedback(response, query, workflow) {
    const items = [];

    response.forEach((item) => {
        if (item.type === 'file') {
            let cliName = item.name;
            cliName = cliName.replace('.md', '');
            const url = item.html_url;
            const urlWebsite = YARN_WEBSITE_CLI + cliName;

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
        }
    });

    const filteredItems = utils.filter(query, items, (item) => {
        return item.get('title');
    });

    workflow.addItems(filteredItems);
    workflow.feedback();
}