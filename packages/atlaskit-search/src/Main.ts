import { Workflow } from "@alfred-wf-node/core";
import ScanAkFolder from "./ScanAkFolder";
import LoadPackageActions from "./actions/LoadPackageActions";
import { executeActionByKey, openInVSCode } from "./actions/packageActions";
import { PackageActionArg, ExecuteActionArg } from "./types";

const commands = {
  LOAD_PKG: "load_all_packages",
  LOAD_ACTIONS_OF_PKG: "load_all_packages",
  SCAN_AK_FOLDER: "scan_ak_folder",
  EXECUTE_AN_ACTION: "execute_action",
  OPEN_ROOT_FOLDER: "open_root_sc_folder"
};
const pkg = require("../package.json");

export default class MainApp {
  wf: Workflow;

  constructor() {
    this.wf = new Workflow();
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
    this.wf.onAction(commands.SCAN_AK_FOLDER, this._executeScanAkFolder);
    this.wf.onAction(commands.OPEN_ROOT_FOLDER, this._executeOpenRootSourceFolder);
  }

  // no argument in EXECUTE_AN_ACTION
  _executeScanAkFolder = () => {
    const mainScan = new ScanAkFolder({
      atlasKitPath: this._getAkFolderPath()
    });
    mainScan.start().then(() => {
      this.wf.info("Finish scanning Ak packages");
    });
  };

  _executeAnAction = (query: ExecuteActionArg | string) => {
    // TODO: remove this check
    this.wf.log('_executeAnAction:query', query);
    this.wf.log('_executeAnAction:query', typeof query);

    if (typeof query === 'string') {
      query = JSON.parse(query) as ExecuteActionArg;
    }

    executeActionByKey(query.actionKey, query.actionArg as PackageActionArg);
  };

  _executeOpenRootSourceFolder = () => {
    openInVSCode.execute(this._getAkFolderPath());
  };

  _getAkFolderPath(): string {
    const path = this.wf.getConfig('akFolder');
    if (!path) {
      this.wf.error('Can not find "akFolder" in Workflow Configuration. Please follow this guide to add the configuration https://www.alfredapp.com/help/workflows/advanced/variables/#Setting%20Workflow%20Environment%20Variables');
    }
    return path;
  }

  start() {
    this.wf.start();
  }
}
