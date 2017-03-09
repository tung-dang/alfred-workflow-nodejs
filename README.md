Alfred 3 Workflow NodeJS Next Library
=====================================

This is a forked version of [https://github.com/giangvo/alfred-workflow-nodejs](https://github.com/giangvo/alfred-workflow-nodejs) and is converted to ES6. 


## Overview
A small library providing helpers to create Alfred Workflow

## Installation

* Use yarn: 'yarn add alfred-workflow-nodejs-next'
* Use npm: 'npm install --save alfred-workflow-nodejs-next'

## Tests

```shell
yarn test

# or in watch mode
yarn test-watch
```

## Docs

* [docs/Workflow & Item](docs/workflow.md) - Build and generate Alfred workflow feedback
* [docs/utilities](docs/utilities.md)  - Helper to filter arrays, run applesripts, etc...
* [docs/storage](docs/storage.md) - Helper to CRUD temporary / permanent(settings) data.


## Notes/Tips

- You can look at some tests in test folder in source code get more about usage.
- You can use `console.trace('==========================', data)` or `console.warn('==========================', data)` to debug code. DO NOT use `console.log` because it is used to return JSON string to Aflred.
