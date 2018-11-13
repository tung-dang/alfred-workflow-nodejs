import { AfWorkflow, storage } from '@alfred-wf-node/core';
import LoadPackageActions from './actions/LoadPackageActions';
import { executeActionByKey } from './actions/packageActions';
import { PackageActionArg, ExecuteActionArg } from './types';

const commands = {
  LOAD_PKG: 'load_all_packages',
  LOAD_ACTIONS_OF_PKG: 'load_all_packages',
  SCAN_AK_FOLDER: 'scan_ak_folder',
  EXECUTE_AN_ACTION: 'execute_action',
  OPEN_ROOT_FOLDER: 'open_root_sc_folder',
  CLEAR_CACHE: 'clear_cache'
};
const pkg = require('../package.json');

export default class MainApp {
  wf: AfWorkflow;

  constructor() {
    this.wf = new AfWorkflow();
    const loadPkgActon = new LoadPackageActions({
      wf: this.wf
    });
    this.wf.setName(pkg.name);
    this.wf.onAction(commands.LOAD_PKG, loadPkgActon._executeLoadAllPackages);

    this.wf.onSubActionSelected(
      commands.LOAD_ACTIONS_OF_PKG,
      loadPkgActon._executeLoadAllActionsOfPackage
    );
    this.wf.onAction(commands.EXECUTE_AN_ACTION, this._executeAnAction);
    this.wf.onAction(commands.SCAN_AK_FOLDER, loadPkgActon._scanAkFolder);
    this.wf.onAction(commands.CLEAR_CACHE, this._clearCache);
    this.wf.onAction(
      commands.OPEN_ROOT_FOLDER,
      loadPkgActon._executeOpenRootSourceFolder
    );
  }

  _clearCache = () => {
    storage.clear();
  };

  _executeAnAction = (query: string) => {
    // this.wf.log('_executeAnAction:query', query);
    // this.wf.log('_executeAnAction:query', typeof query);

    let arg: ExecuteActionArg | null = null;
    if (typeof query === 'string') {
      arg = JSON.parse(query) as ExecuteActionArg;
    }

    if (arg) {
      executeActionByKey(arg.actionKey, arg.actionArg as PackageActionArg);
    } else {
      this.wf.error('Expect query is a string!');
    }
  };

  start() {
    this.wf.start();
  }
}
