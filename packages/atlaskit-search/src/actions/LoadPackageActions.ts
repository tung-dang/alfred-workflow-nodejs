import {
  Item as AfItem,
  IAction,
  utils as nodeJSUtils,
  storage
} from '@alfred-wf-node/core';
import { packageActions } from './packageActions';
import { GroupPackage, PackageActionArg, Package } from '../types';
import ScanAkFolder from '../ScanAkFolder';
import { openInVSCode } from './packageActions';

const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;

export default class LoadPackageActions {
  wf: any;
  akGroups: GroupPackage[];

  constructor(options) {
    this.wf = options.wf;
    this.akGroups = [];

    const keyCache = 'ak_groups';
    try {
      const dataFromCache = storage.get(keyCache);
      if (dataFromCache) {
        console.warn('Get data from cache...:)');
        this.akGroups = dataFromCache;
      } else {
        console.warn('Get data from file...:)');
        this._scanAkFolder().then(() => {
          this.akGroups = require('../../atlaskit_pkgs.json');
          // cache in 24h
          storage.set(keyCache, this.akGroups, ONE_DAY);
        });
      }
    } catch (e) {
      this.wf.error(
        'Can not read atlaskit_pkgs.json file. Please run ak_scan keyword first.'
      );
    }
  }

  _eachPackage(callback: (pkg: Package) => void) {
    this.akGroups.forEach((group: GroupPackage) => {
      group.children.forEach(callback);
    });
  }

  _getProjectActionArg(pkg: Package): PackageActionArg {
    const baseDocLink = 'https://atlaskit.atlassian.com/packages';
    return {
      localFullPage: pkg.path,
      docLink: `${baseDocLink}/${pkg.groupName}/${pkg.name}`
    };
  }

  _executeLoadAllPackages = (query: string) => {
    const items: AfItem[] = [];
    this._eachPackage((pkg: Package) => {
      if (pkg.name.includes(query) || pkg.groupName.includes(query)) {
        items.push(
          new AfItem({
            uid: pkg.name,
            title: pkg.name,
            subtitle: pkg.name + '@' + pkg.version,
            hasSubItems: true,
            arg: JSON.stringify(this._getProjectActionArg(pkg)),
            icon: 'icons/package.png'
          })
        );
      }
    });

    this.wf.addItems(items);
    this.wf.feedback();
  };

  _executeLoadAllActionsOfPackage = (
    query: string,
    previousSelectedTitle: string,
    previousSelectedArg: PackageActionArg
  ) => {
    this.wf.log('_executeLoadAllActionsOfPackage:query: ', query);
    this.wf.log(
      '_executeLoadAllActionsOfPackage:previousSelectedTitle: ',
      previousSelectedTitle
    );
    this.wf.log(
      '_executeLoadAllActionsOfPackage:previousSelectedArg: ',
      previousSelectedArg
    );

    const filteredActions: IAction[] = nodeJSUtils.filter(
      query,
      packageActions,
      (pkgAction: IAction) => {
        return (
          pkgAction.name.toLowerCase() +
          ' ' +
          (pkgAction.getDesc ? pkgAction.getDesc(previousSelectedArg) : '')
        );
      }
    );

    if (filteredActions.length === 0) {
      this.wf.info('Can not find any actions for this package!');
      return;
    }

    // build Alfred items
    const items: AfItem[] = [];
    filteredActions.forEach((pkAction: IAction) => {
      items.push(pkAction.toAlfredItem(previousSelectedArg));
    });

    this.wf.addItems(items);
    this.wf.feedback();
  };

  _scanAkFolder = () => {
    const mainScan = new ScanAkFolder({
      atlasKitPath: this._getAkFolderPath()
    });

    return mainScan.start().then(() => {
      this.wf.info('Finish scanning Ak packages');
    });
  };

  _executeOpenRootSourceFolder = () => {
    openInVSCode.execute(this._getAkFolderPath());
  };

  _getAkFolderPath(): string {
    const path = this.wf.getConfig('akFolder');
    if (!path) {
      this.wf.error(
        'Can not find "akFolder" in Workflow Configuration. Please follow this guide to add the configuration https://www.alfredapp.com/help/workflows/advanced/variables/#Setting%20Workflow%20Environment%20Variables'
      );
    }
    return path;
  }
}
