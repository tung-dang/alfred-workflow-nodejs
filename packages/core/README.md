Alfred 3 Workflow NodeJS Next library
=====================================

[![npm version](https://badge.fury.io/js/alfred-workflow-nodejs-next.svg)](https://badge.fury.io/js/alfred-workflow-nodejs-next)
![Travis build](https://img.shields.io/travis/tung-dang/alfred-workflow-nodejs-next.svg?style=flat-square)
[![codecov](https://codecov.io/gh/tung-dang/alfred-workflow-nodejs-next/branch/master/graph/badge.svg)](https://codecov.io/gh/tung-dang/alfred-workflow-nodejs-next)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://opensource.org/licenses/MIT)


## Overview
A small library providing helpers to create [Alfred Workflow](https://www.alfredapp.com/workflows/).
This is a forked version of [https://github.com/giangvo/alfred-workflow-nodejs](https://github.com/giangvo/alfred-workflow-nodejs).
This forked one is converted to ES6 and is simplified some APIs so this forked one is not completely compatible with original one.   
Because `alfred-workflow-nodejs-next` returns JSON format to Alfred so this is compatible with Alfred 3 or above only.

## Installation

* Use yarn: `yarn add alfred-workflow-nodejs-next`
* Use npm: `npm install --save alfred-workflow-nodejs-next`

If you have any issue with yarn or npm, run `yarn run clean` to remove all packages in `node_modules` folder.

## Tests

```shell
# running test
yarn test

# or running test in watch mode when developing
yarn test-watch

# running test with reporting coverage
yarn test-coverage
```

## Docs

* [docs/Workflow & Item](docs/workflow-items.md) - Build and generate Alfred workflow feedback
* [docs/Utilities](docs/utilities.md)  - Helper to filter arrays, run applesripts, etc...
* [docs/Storage](docs/storage.md) - Helper to CRUD temporary / permanent(settings) data.


## Sample workflow using this library. 
- [alfred-workflow-go-links](https://github.com/tung-dang/alfred-workflow-go-links)
- [alfred-workflow-yarn-api-search](https://github.com/tung-dang/alfred-workflow-yarn-api-search)
- [alfred-workflow-immutablejs-api-search](https://github.com/tung-dang/alfred-workflow-immutablejs-api-search)
- TODO: add more 

Notice:  [docs/import-workflow-source-to-alfred.md](docs/import-workflow-source-to-alfred.md) - to show how to import workflow source code into Alfred. 

## Notes/Tips

- You can look at some tests in test folder in source code get more about usage.
- You can use `console.trace('==========================', data)` or `console.warn('==========================', data)` to debug code. 
**DO NOT** use `console.log` because it is used to return JSON string data to Alfred.
- Open "Toggle Debugging Mode" of Alfred to see all logs when developing.