import { Workflow, Item as AfItem, storage, utils } from '@alfred-wf-node/core';
import { openLinkExecutor } from './executors.js';
import * as github from 'octonode';
import { FileItem } from "./types";

const YARN_REPO = 'yarnpkg/website';
const YARN_API_PATH = 'lang/en/docs/cli';
const BRANCH = 'master';
const YARN_WEBSITE_CLI = 'https://yarnpkg.com/en/docs/cli/';

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
const pkg = require("../package.json");

export default class MainApp {
  workflow: Workflow;

  constructor() {
    this.workflow = new Workflow({
      isDebug: false
    });
    this.workflow.setName(pkg.name);

    this.workflow.onAction(commands.LOAD_ALL_LINKS, this._loadAllLinks);
    this.workflow.onAction(commands.CLEAR_CACHE, storage.clear);

    this.workflow.onAction(commands.OPEN_LINK, arg => {
      if (typeof arg === 'string') {
        openLinkExecutor.execute(JSON.parse(arg));
      } else {
        openLinkExecutor.execute(arg);
      }
    });
  }

  _loadAllLinks = (query) => {
    const dataFromCache = storage.get('cache_links');
    if (dataFromCache) {
      console.warn('Get data from cache...');
      this._generateFeedback(dataFromCache, query);
      return;
    }

    console.warn('Start fetching...');
    ghrepo.contents(YARN_API_PATH, BRANCH, (error, res) => {
      if (error) {
        console.warn('Can not fetch file list', error);
        return;
      }

      storage.set('cache_links', res, ONE_WEEK);
      this._generateFeedback(res, query);
    });
  };

  _generateFeedback(response: FileItem[], query: string) {
    const items = [];

    response.forEach(item => {
      if (item.type === 'file') {
        let cliName = item.name;
        cliName = cliName.replace('.md', '');
        const url = item.html_url;
        const urlWebsite = YARN_WEBSITE_CLI + cliName;

        items.push(
          new AfItem({
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
          })
        );
      }
    });

    // const filteredItems = utils.filter(query, items, (item: AfItem) => {
    //   return item.get('title');
    // });

    // this.workflow.addItems(filteredItems);
    this.workflow.addItems(items);
    this.workflow.feedback();
  }

  start() {
    this.workflow.start();
  }
}
