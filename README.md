Alfred 3 Workflow Nodejs Next Library
=========

This is a forked version of [https://github.com/giangvo/alfred-workflow-nodejs](https://github.com/giangvo/alfred-workflow-nodejs) and converted to ES6. This repo is used for some my personal experiment Alfred workflow.


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

* [docs/Workflow & Item](docs/workflow.md) - Build and generate feedbacks
* [docs/settings](docs/settings.md) - Helper to CRUD settings, store password securely.
* [docs/utilities](docs/utilities.md)  - Helper to filter arrays, run applesripts, etc...
* [docs/storage](docs/storage.md) - Helper to CRUD temporary data which has timeout caching.

## Examples
-
```js
var settings = AlfredNode.settings;
settings.set("key", "stringValue");
settings.get("key");
settings.remove("key");
settings.clear(); //clear all settings!!!
settings.setPassword("username", "password"); // store passwork into keychain
// get password from settings, async function
settings.getPassword("username", function(error, password){
    console.log(password);
});
```

## Notes/Tips

- You can look at some tests in test folder in source code get more about usage.
- You can use `console.trace('==========================', data)` or `console.warn('==========================', data)` to debug code. DO NOT use `console.log` because it is used to return JSON string to Aflred.
