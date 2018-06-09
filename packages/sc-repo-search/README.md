## Fearures

- List all projects in pre-defined source folders which is configured in `source-folders` in `config.json`

- For each project, there are set of actions
    + Open in Finder
    + Open in Iterm
    + Open in Iterm (Current session)
    + Open in Iterm (New split panel)
    + Open in Sublime Text editor
    + Open Intellij IDEA editor
    + Open Visual Studio Code editor
    + Open in SourceTree
    + Open project's repo link
    + Open project's pull requests link
    + Open project's create pullrequest link
    + to be updated...Please create issue to request more features
- Detect project types
    + Java
    + Nodejs
    + to be updated...Please create issue to request more features
- Detect project git info to get repo links
    + Github
    + Bitbutket
    + Stash

## Installation

1. Download latest node version [v7.2.1](https://nodejs.org/dist/v7.2.1/). `.nvmrc` file specifies necessary node version
2. Download worfklow file in `exported-workflow` folder of this repo.
3. Import workflow
4. Open workflow folder in terminal and run `npm install` to install node modules. Make sure you are running in correct node version.
5. Make sure there is a config file - `config.js` in root folder of workflow. If it is not existed, please clone the file `config.sample.json` and rename it to `config.json`
6. Open each workflow steps in Workflows settings, make sure node path is correct. Default node path is `/usr/local/node`. You can use other node path if you want.

## Usage
### Commands
- `sc`: Search projects, all projects is cached in local for 24h. So when you add new project, you should run `sc_clean_cache` to clear cache.
- `sc_clean_cache`: to clear cache
- `scconfig`: Open config file to set source code folders

### Configs
- `source-containers`: All sub folders (1 level) in container are loaded at project
- `stash-server`: Stash server domain. e.g: stash.your-compapy.com. (Optional, config it if you want to detect stash project)

### Project actions
When selecting a project by pressing `tab` or `enter` => a list of project actions will be loaded. List of actions will be different base on project type and git info.

## Troubles shooting:
- `Open in IDEA` does not work: open workflow dir in terminal and run `chmod +7 idea` (set run permission for idea script)
- `Open in Sublime` does not work: Check if "/usr/local/bin/subl" is existed.
If not, run `ln -s /Applications/Sublime\ Text\ 2.app/Contents/SharedSupport/bin/subl /usr/local/bin/subl` to create `subl` command

## Know issues
- Error with paths start with `~`
