Alfred 3 Workflow NodeJS Next Library
=====================================

![Travis build](https://img.shields.io/travis/tung-dang/alfred-workflow-nodejs-next.svg)


## Overview
A small library providing helpers to create [Alfred Workflow](https://www.alfredapp.com/workflows/).
This is a forked version of [https://github.com/giangvo/alfred-workflow-nodejs](https://github.com/giangvo/alfred-workflow-nodejs).
This forked one is converted to ES6 and is simplified some APIs so this forked one is not completely compatible with original one.   
Because `alfred-workflow-nodejs-next` returns JSON format to Alfred so this is compatible with Alfred 3 or above only.

## Installation

* Use yarn: `yarn add alfred-workflow-nodejs-next`
* Use npm: `npm install --save alfred-workflow-nodejs-next`

## Tests

```shell
# running test
yarn test

# or running test in watch mode
yarn test-watch
```

## Docs

* [docs/Workflow & Item](docs/workflow-items.md) - Build and generate Alfred workflow feedback
* [docs/Utilities](docs/utilities.md)  - Helper to filter arrays, run applesripts, etc...
* [docs/Storage](docs/storage.md) - Helper to CRUD temporary / permanent(settings) data.


## Sample workflows
- [alfred-workflow-go-links](https://github.com/tung-dang/alfred-workflow-go-links)
- TODO: add more 

## Notes/Tips

- You can look at some tests in test folder in source code get more about usage.
- You can use `console.trace('==========================', data)` or `console.warn('==========================', data)` to debug code. 
**DO NOT** use `console.log` because it is used to return JSON string data to Alfred.
