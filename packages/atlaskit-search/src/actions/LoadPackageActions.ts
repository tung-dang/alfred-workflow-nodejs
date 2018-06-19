import { Item as AfItem, utils as nodeJSUtils } from '@alfred-wf-node/core';
import { packageActions } from './packageActions';
import {
  GroupPackage,
  PackageActionArg,
  PackageAction,
  ExecuteActionArg,
  Package
} from '../types';

export default class LoadPackageActions {
  wf: any;
  akGroups: GroupPackage[];

  constructor(options) {
    this.wf = options.wf;
    this.akGroups = [];
    try {
      this.akGroups = require('../../atlaskit_pkgs.json');
    } catch(e) {
      this.wf.error("Can not read atlaskit_pkgs.json file. Please run ak_scan keyword first.");
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
      if (
        pkg.name.includes(query) ||
        pkg.groupName.includes(query)
      ) {
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
    this.wf.log('_executeLoadAllActionsOfPackage:previousSelectedTitle: ', previousSelectedTitle);
    this.wf.log('_executeLoadAllActionsOfPackage:previousSelectedArg: ', previousSelectedArg);

    const filteredActions: PackageAction[] = nodeJSUtils.filter(query, packageActions, (
      pkgAction: PackageAction
    ) => {
      return pkgAction.name.toLowerCase() + ' '
      + (pkgAction.getDesc ? pkgAction.getDesc(previousSelectedArg) : '')
    });

    if (filteredActions.length === 0) {
      this.wf.info('Can not find any actions for this package!');
      return;
    }

    // build Alfred items
    const items: AfItem[] = [];
    filteredActions.forEach((pkAction: PackageAction) => {
      const arg: ExecuteActionArg = {
        actionKey: pkAction.key,
        actionArg: previousSelectedArg
      };

      items.push(
        new AfItem({
          uid: pkAction.key,
          title: pkAction.name,
          subtitle: pkAction.getDesc
            ? pkAction.getDesc(previousSelectedArg)
            : pkAction.name,
          hasSubItems: false,
          arg
        })
      );
    });

    this.wf.addItems(items);
    this.wf.feedback();
  };
}
