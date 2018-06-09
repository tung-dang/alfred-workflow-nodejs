const { ICONS, Item, storage, utils: nodeJSUtils } = require('alfred-workflow-nodejs-next');

const config = require('../config.json');
const sourceFolders = config['source-folders'];

const utils = require('./utils');

class LoadProjects {
    constructor(options) {
        this.workflow = options.workflow;
        this.projects = this._loadProjectData();
    }

    _loadProjectData() {
        var projects = [];
         // get from cache
         const keyCache = 'load_projects';
         const data = storage.get(keyCache);
         if (data) {
             console.warn('Load all projects from cache :)');
             projects = data;
         } else {
             console.warn('Load all projects from hard disk! :(');
             sourceFolders.forEach((path) => {
                 const childFolders = utils.getDirectories(path);
                 childFolders && childFolders.forEach((folder) => {
                     projects.push({
                         name: folder,
                         path: path + '/' + folder
                     });
                 });
             });

             // cache in 24h
             storage.set(keyCache, projects);
         }
         return data;
    }

    run(query) {
        const projects = this.projects;

        if (projects.length === 0) {
            this.workflow.addItem(new Item({
                title: 'No project path configured. Enter to open config file.',
                icon: ICONS.INFO,
                valid: true
                // arg: JSON.stringify({
                //     action: OpenConfigFileAction.actionName
                // })
            }));

            this.workflow.feedback();
            return;
        }

        const filteredProjects = nodeJSUtils.filter(query, projects, (item) => {
            return item.name.toLowerCase() + ' ' + item.name.toLowerCase().replace(/\-/g, ' ');
        });

        filteredProjects.forEach((project) => {
            const { name, path } = project;

            utils.detectProjectInfo(path, (info) => {
                const { gitInfo, projectType } = info;
                const arg = {
                    name,
                    path,
                    gitInfo,
                    projectType
                };

                this.workflow.addItem(new Item({
                    uid: path,
                    title: name,
                    subtitle: path,
                    icon: 'icons/' + (projectType ? projectType : 'folder') + '.png',
                    hasSubItems: true,
                    valid: false,

                    // arg is passed to as `selectedData` argument in handler `workflow.onMenuItemSelected(commands.LOAD_PROJECTS)`
                    arg: JSON.stringify(arg)
                }));
            });
        });

        this.workflow.feedback();
    }
}

module.exports = LoadProjects
