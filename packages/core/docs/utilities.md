Some utilities


### `debug()` 
Show log message by using `console.warn` since `console.log` is used to log JSON string only.
The log message is not printed in `testing` environment.


### `filter(query, list, keyBuilder)`

Filter list of object using fuzzy matching. Example: 

```js
const { utils } = require('alfred-workflow-nodejs-next');

// filter array of string by using fuzzy matching
utils.filter('a', ['a', 'b', 'c'], (item) => item);
// => return ['a']

// filter array of object by using fuzzy matching
utils.filter('pen', [
    { name: 'pencil' }, 
    { name: 'pen' }, 
    { name: 'book' }
], (item) => item.name);
// => return [{ name: 'pencil' }, { name: 'pen' }]
```


### `memorizePromise(keyCache, ttl, func, isDebug)`

Help to cache result of a promise. Example, you have a promise to get a data like this: 

```js
fetchDataFromServer(url).then((data) => {
    // do something with data
});
```

We can use `memorizePrmise` to help to save cached data to local which is resolved by a promise.

```js
const { utils } = require('alfred-workflow-nodejs-next');
const ONE_M = 1000 * 60;
const _30_MINUTES = ONE_M * 30;

utils.memorizePrmise('fetchDataFromServer_cache_key', _30_MINUTES, () => {
    return fetchDataFromServer(url);
}).then((data) => {
    // data may be gotten from cache instead of from server. 
});
```

## Icons - Some built-in icons

Icons are from `/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources`

```js
const { constants } = require('alfred-workflow-nodejs-next');

// constants.ICONS.ERROR
// constants.ICONS.INFO 
// ...
```

See more in `src/constants.js`