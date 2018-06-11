const git = require('git-utils');

const path = '/Users/tthanhdang/src/_atlassian/atlaskit-mk-2';
const repo = git.open(path, false);

console.log('==================', repo);
// console.log('==================', repo.getHead());
// console.log('==================', repo.getShortHead());
console.log('==================', repo.getWorkingDirectory());
// console.log('==================', repo.getConfigValue('remote.origin.url'));
// console.log('==================', repo.getReferences());
