// import * as fs from './fs';

// const siteData: GroupPackage = data;
// export default siteData;

// const dirs = fs.getDirectories(data.children);

// import { GroupPackage } from '../types';

// function isInternal(groupId, pkgId) {
//   const pkgInfo = NAV_DATA[groupId].find(a => a.name === pkgId);
//   return (
//     pkgInfo &&
//     pkgInfo.config &&
//     pkgInfo.config.atlaskit &&
//     pkgInfo.config.atlaskit.internal
//   );
// }

// const publicPackages = {
//   type: 'dir',
//   id: 'packages',
//   children: [],
// };

// const packageDirs: GroupPackage = fs.getById(dirs, 'packages');

// for (const child of fs.getDirectories(packageDirs.children)) {
//   const children = child.children.filter(pkg => !isInternal(child.id, pkg.id));
//   publicPackages.children.push(Object.assign({}, child, { children }));
// }

// export const packages: GroupPackage = fs.getById(dirs, 'packages');
