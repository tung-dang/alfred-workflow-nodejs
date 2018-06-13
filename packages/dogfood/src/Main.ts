import { Workflow, Item as AfItem } from '@alfred-wf-node/core';
// import * as github from 'octonode';
// import { FileItem } from './types';

// const YARN_REPO = 'yarnpkg/website';
// const YARN_API_PATH = 'lang/en/docs/cli';
// const BRANCH = 'master';
// const YARN_WEBSITE_CLI = 'https://yarnpkg.com/en/docs/cli/';

// const client = github.client();
// const ghrepo = client.repo(YARN_REPO);

const commands = {
  FIRST_COMMAND: 'test1'
};
const pkg = require('../package.json');

export default class MainApp {
  wf: Workflow;

  constructor() {
    this.wf = new Workflow({
      isDebug: false
    });
    this.wf.setName(pkg.name);
    this.wf.onAction(commands.FIRST_COMMAND, this._testError);
  }

  _testDefaultItem = query => {
    const items: AfItem[] = [];

    items.push(
      new AfItem({
        uid: 'test-uid',
        title: 'test-title' + query,
        subtitle: 'test-subtitle',
        hasSubItems: false,
        arg: {
          // Default: open Yarn website link
          actionName: 'open_link',
          link: 'test-link'
        }
        // mods: {
        //   // if users press CMD, open GitHub link
        //   cmd: {
        //     arg: {
        //       actionName: 'open_link',
        //       link: url
        //     },
        //     subtitle: url
        //   }
        // }
      })
    );

    // this.wf.addItems(filteredItems);
    this.wf.addItems(items);
    this.wf.feedback();
  };

  _testError = query => {
    // this.wf.error("title error", "subtitle of error" + query);
    this.wf.warning('title error', 'subtitle of error' + query);
    this.wf.feedback();
  };

  start() {
    this.wf.start();
  }
}
