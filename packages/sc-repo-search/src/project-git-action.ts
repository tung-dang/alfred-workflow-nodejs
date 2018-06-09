import ProjectAction from './ProjectAction';

export default class ProjectGitAction extends ProjectAction {
  constructor(options) {
    super(options);
  }

  shouldDisplay(data) {
    return !!data.gitInfo;
  }

  getIcon(data) {
    return 'icons/' + data.gitInfo.server + '.png';
  }
}
