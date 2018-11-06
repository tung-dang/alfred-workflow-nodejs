import * as fs from 'fs';
import { getDirs, isFileExists } from './utils/fs';
import { Folder, GroupPackage, Package } from './types';

export default class ScanAkFolder {
  atlasKitPath: string;
  packagesPath: string;
  outputFile: string;
  groups: GroupPackage[];

  constructor(options) {
    this.atlasKitPath = options.atlasKitPath;
    this.packagesPath = this.atlasKitPath + '/packages';
    this.outputFile = 'atlaskit_pkgs.json';
    this.groups = [];
  }

  _eachPackage(callback: (pkg: Package) => void) {
    this.groups.forEach((group: GroupPackage) => {
      group.children.forEach((pkg: Package) => {
        pkg.groupName = group.name;
        callback(pkg);
      });
    });
  }

  _filterGroupDoesNotHaveAnyPackage() {
    this.groups = this.groups.filter(
      (group: GroupPackage) => group.children.length > 0
    );
  }

  start() {
    // each 1st folder is a group of packages
    const dirs = getDirs(this.packagesPath);
    dirs.forEach((dir: Folder) => {
      this.groups.push({
        ...dir,
        children: []
      });
    });

    this.groups.forEach((group: GroupPackage) => {
      // read children dirs
      const dirs = getDirs(group.path);

      dirs.forEach(dir => {
        group.children.push({
          ...dir,
          groupName: group.name
        });
      });
    });

    this._filterGroupDoesNotHaveAnyPackage();

    // make sure there is package.json file in each package
    this.groups.forEach((group: GroupPackage) => {
      group.children = group.children.filter((pkg: Package) => {
        return isFileExists(pkg.path + '/package.json');
      });
    });

    this._filterGroupDoesNotHaveAnyPackage();

    // read package info
    this._eachPackage((pkg: Package) => {
      const pkgInfo = require(pkg.path + '/package.json');
      pkg.version = pkgInfo['version'];
    });

    return new Promise(resolve => {
      fs.writeFile(
        this.outputFile,
        JSON.stringify(this.groups, null, '  '),
        () => {
          console.info('Write output file successfully');
          resolve();
        }
      );
    });
  }
}
