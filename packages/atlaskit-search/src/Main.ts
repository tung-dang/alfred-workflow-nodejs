import { Workflow } from '@alfred-wf-node/core';
import ScanAkFolder from './ScanAkFolder';
import LoadPackageActions from './actions/LoadPackageActions';
import { executeActionByKey } from './actions/packageActions';
import { PackageActionArg, ExecuteActionArg } from './types';

const config = require('../config.json');
const AK_FOLDER = config['akFolder'];

const commands = {
  LOAD_PKG: 'load_all_packages',
  LOAD_ACTIONS_OF_PKG: 'load_all_packages',
  SCAN_AK_FOLDER: 'scan_ak_folder',
  EXECUTE_AN_ACTION: 'execute_action'
};
const pkg = require('../package.json');

export default class MainApp {
  wf: Workflow;

  constructor() {
    this.wf = new Workflow({
      isDebug: false
    });
    const loadPkgActon = new LoadPackageActions({
      wf: this.wf
    });
    this.wf.setName(pkg.name);
    this.wf.onAction(commands.LOAD_PKG, loadPkgActon._executeLoadAllPackages);

    this.wf.onSubActionSelected(
      commands.LOAD_ACTIONS_OF_PKG,
      loadPkgActon._executeLoadAllActionsOfPackage
    );
    this.wf.onAction(commands.SCAN_AK_FOLDER, this._executeScanAkFolder);

    this.wf.onAction(commands.EXECUTE_AN_ACTION, this._executeAnAction);
  }

  // no argument in EXECUTE_AN_ACTION
  _executeScanAkFolder = () => {
    const mainScan = new ScanAkFolder({
      atlasKitPath: AK_FOLDER
    });
    mainScan.start().then(() => {
      this.wf.info('Finish scanning Ak packages');
    });
  };

  _executeAnAction = (arg: ExecuteActionArg) => {
    executeActionByKey(arg.actionKey, arg.actionArg as PackageActionArg);
  };

  start() {
    this.wf.start();
  }
}
