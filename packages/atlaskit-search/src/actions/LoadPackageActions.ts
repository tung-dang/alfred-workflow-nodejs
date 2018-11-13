import {
  AfItem,
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
const AK_WEBSITE = 'https://atlaskit.atlassian.com/';
const AK_PACKAGES_LINK = 'https://atlaskit.atlassian.com/packages';

export default class LoadPackageActions {
  wf: any;
  akGroups: GroupPackage[];
  akFolderPath: string;

  constructor(options) {
    this.wf = options.wf;
    this.akGroups = [];
    this.akFolderPath = this._getAkFolderPath();

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
    return {
      localFullPage: pkg.path,
      docLink: pkg.groupName
        ? `${AK_PACKAGES_LINK}/${pkg.groupName}/${pkg.name}`
        : AK_WEBSITE
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


    // open AK fodler
    items.push(
      new AfItem({
        uid: 'ak-folder',
        title: 'AK folder',
        subtitle: 'Open AK folder',
        hasSubItems: true,
        arg: JSON.stringify(this._getProjectActionArg({
          path: this.akFolderPath,
          name: 'Ak Folder',
          groupName: '',
          version: '0.0.0'
        })),
        icon: 'icons/ak_icon.png'
      })
    );

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
      atlasKitPath: this.akFolderPath
    });

    return mainScan.start().then(() => {
      this.wf.info('Finish scanning Ak packages');
    });
  };

  _executeOpenRootSourceFolder = () => {
    openInVSCode.execute(this.akFolderPath);
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
