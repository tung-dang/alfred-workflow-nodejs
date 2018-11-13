import { AfWorkflow, AfItem, storage, utils, OpenBrowserLink } from '@alfred-wf-node/core';
import * as github from 'octonode';
import { FileItem, OPEN_LINK_ARG } from './types';

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
const ONE_MONTH = ONE_WEEK * 4;

const commands = {
  LOAD_ALL_LINKS: 'load_all_links',
  OPEN_LINK: 'open_link',
  CLEAR_CACHE: 'clear_cache'
};
const pkg = require('../package.json');

export const openLink = new OpenBrowserLink({
  propertyName: 'link'
});


export default class MainApp {
  wf: AfWorkflow;

  constructor() {
    this.wf = new AfWorkflow();
    this.wf.setName(pkg.name);
    this.wf.onAction(commands.LOAD_ALL_LINKS, this._loadAllLinks);
    this.wf.onAction(commands.CLEAR_CACHE, storage.clear);

    this.wf.onAction(commands.OPEN_LINK, arg => {
      if (typeof arg === 'string') {
        openLink.execute(JSON.parse(arg));
      } else {
        openLink.execute(arg);
      }
    });
  }

  _loadAllLinks = (query) => {
    const dataFromCache = storage.get('cache_links');
    if (dataFromCache) {
      console.warn('Get data from cache...:)');
      this._generateFeedback(dataFromCache, query);
      return;
    }

    console.warn('Start fetching...:(');
    // TODO: cannot show loading here
    // this.wf.showLoading();
    ghrepo.contents(YARN_API_PATH, BRANCH, (error, res) => {
      if (error) {
        this.wf.error(
          'Can not fetch file list from: ',
          YARN_API_PATH,
          ' - Error: ',
          error
        );
        return;
      }

      storage.set('cache_links', res, ONE_MONTH);
      this._generateFeedback(res, query);
    });
  };

  _generateFeedback(response: FileItem[], query: string) {
    const items: AfItem[] = [];

    response.forEach(item => {
      if (item.type !== 'file') {
        return;
      }

      let cliName = item.name;
      cliName = cliName.replace('.md', '');
      const url = item.html_url;
      const urlWebsite = YARN_WEBSITE_CLI + cliName;
      const openLinkArg: OPEN_LINK_ARG = {
        // Default: open Yarn website link
        actionName: 'open_browser_link',
        link: urlWebsite
      };
      const openLinkWithCmdKeyArg: OPEN_LINK_ARG = {
        // Default: open Yarn website link
        actionName: 'open_browser_link',
        link: url
      };

      items.push(
        new AfItem({
          uid: url,
          title: cliName,
          subtitle: urlWebsite,
          arg: openLinkArg,
          mods: {
            // if users press CMD, open GitHub link
            cmd: {
              arg: openLinkWithCmdKeyArg,
              subtitle: url
            }
          }
        })
      );
    });

    const filteredItems = utils.filter(query, items, item => item.get('title'));

    this.wf.addItems(filteredItems);
    this.wf.feedback();
  }

  start() {
    this.wf.start();
  }
}
