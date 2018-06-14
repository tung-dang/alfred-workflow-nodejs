import {
  Item,
  storage,
  utils as nodeJSUtils
} from '@alfred-wf-node/core';
import {
  ICON_INFO
} from '@alfred-wf-node/core/dist/constants';

const config = require('../../config.json');
const sourceFolders = config['source-folders'];

import * as utils from '../utils';
import { CommandParams, FolderInfo } from '../types';

export default class LoadProjects {
  wf: any;
  projects: any;

  constructor(options) {
    this.wf = options.wf;
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
    sourceFolders.forEach(path => {
      const childFolders = utils.getDirectories(path);
      childFolders.forEach((folder: string) => {
        folders.push({
          name: folder,
          path: path + '/' + folder
        });
      });
    });

    // cache in 24h
    storage.set(keyCache, folders);

    return folders;
  }

  _renderNoResult() {
    this.wf.addItem(
      new Item({
        title: 'No project path configured. Enter to open config file.',
        icon: ICON_INFO,
        // arg: JSON.stringify({
        //     action: OpenConfigFileAction.actionName
        // })
      })
    );

    this.wf.feedback();
  }

  run = (query: string) => {
    this.projects = this._loadProjectData();

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

      const info = utils.getProjectInfo(path);
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
}
