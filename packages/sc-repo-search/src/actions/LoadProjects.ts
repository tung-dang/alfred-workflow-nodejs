import {
  Item,
  storage,
  utils as nodeJSUtils,
  IAction,
  Workflow
} from '@alfred-wf-node/core';

import * as utils from '../utils';
import { CommandParams, FolderInfo } from '../types';
import { projectActions } from './project-actions';
import ProjectAction from './ProjectAction';

const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_WEEK = ONE_DAY * 7;

export default class LoadProjects {
  wf: Workflow;
  projects: any;
  STASH_SERVER_URL: string;
  SOURCE_FOLDERS: string[];
  HOME_PATH: string;

  constructor(options) {
    this.wf = options.wf;

    this.SOURCE_FOLDERS = this.wf.getConfig('sourceFolders').split(',');
    this.STASH_SERVER_URL = this.wf.getConfig('stashServer');
    this.HOME_PATH = this.wf.getConfig('HOME');
  }

  _loadProjectData() {
    // get from cache
    const keyCache = 'load_projects';
    const data = storage.get(keyCache);

    if (data) {
      console.warn('Load all projects from cache :)');
      return data;
    }

    const folders: FolderInfo[] = [];
    console.warn('Load all projects from hard disk! :(');
    this.SOURCE_FOLDERS.forEach((path: string) => {
      // replace ~ with HOME_PATH
      path = path.trim();
      path = path.replace('~', this.HOME_PATH);
      const childFolders = utils.getDirectories(path);
      childFolders.forEach((folder: string) => {
        folders.push({
          name: folder,
          path: path + '/' + folder
        });
      });
    });

    // cache in 24h
    storage.set(keyCache, folders, ONE_WEEK);

    return folders;
  }

  _renderNoResult() {
    this.wf.info('No project path configured. Enter to open config file.');
  }

  executeLoadProjects = (query: string) => {
    this.projects = this._loadProjectData();

    this.wf.log('this.projects', this.projects);

    if (this.projects.length === 0) {
      this._renderNoResult();
      return;
    }

    // filter projects
    const filteredProjects = nodeJSUtils.filter(query, this.projects, item => {
      return (
        item.name.toLowerCase() +
        ' ' +
        item.name.toLowerCase().replace(/\-/g, ' ')
      );
    });

    filteredProjects.forEach((project: FolderInfo) => {
      const { name, path } = project;

      const info = utils.getProjectInfo(path, this.STASH_SERVER_URL);
      // cannot find project type
      if (!info) {
        return;
      }

      const { gitInfo, projectType } = info;

      const commandParams: CommandParams = {
        name,
        path,
        gitInfo,
        projectType
      };

      this.wf.addItem(
        new Item({
          uid: path,
          title: name,
          subtitle: path,
          icon: 'icons/' + (projectType || 'folder') + '.png',
          hasSubItems: true,
          valid: false,

          // arg is passed to as `selectedData` argument in handler `wf.onMenuItemSelected(commands.LOAD_PROJECTS)`
          arg: JSON.stringify(commandParams)
        })
      );
    });

    this.wf.feedback();
  };

  executeLoadActionsOfProject = (
    query: string,
    previousSelectedTitle: string,
    previousSelectedArg: CommandParams
  ) => {
    this.wf.log(
      'executeLoadActionsOfProject:previousSelectedTitle: ',
      previousSelectedTitle
    );
    this.wf.log(
      'executeLoadActionsOfProject:previousSelectedArg: ',
      previousSelectedArg
    );

    const filteredActions = nodeJSUtils.filter(query, projectActions, function(
      projectAction
    ) {
      return projectAction.filterKey
        ? projectAction.filterKey().toLowerCase()
        : projectAction.name
          ? projectAction.name
          : '';
    });

    if (filteredActions.length === 0) {
      this.wf.info('Can not found any actions for this project');
      return;
    }

    const items: Item[] = [];

    filteredActions.forEach((projectAction: ProjectAction | IAction) => {
      let item;
      if ('build' in projectAction) {
        item = projectAction.build(previousSelectedArg);
      } else {
        item = projectAction.toAlfredItem(previousSelectedArg);
      }

      item && items.push(item);
    });

    this.wf.addItems(items);
    this.wf.feedback();
  };
}
