## Storage
CRUD a local data with timeout. Example:  

```js
const { storage } = require('alfred-workflow-nodejs-next');

storage.set('key', 'stringValue');
storage.get('key');
storage.remove('key');
storage.clear(); 
```

### ` set(key, value, ttl)`
Save a data to storage with a key. 
`ttl` is time out

### `get(key)`
Get a saved data by key. If data is timeout, it will return undefined.  

### `remove(key)`
Remove saved data by key.

### `clear()`
Clear all saved data 

## Settings
Settings is saved data which does not have timeout. It will be saved permanently.

###  `getSetting(key)`
Get a setting value by key

### `setSetting(key, value)`
Save a setting value by key

### `removeSetting(key)` 
Remove/clear a setting value by key

## Passwords

```js
const { storage } = require('alfred-workflow-nodejs-next');

storage.setSetting('username', 'tungdang')
const username = storage.getSetting('username');
const getPasswordPromise = storage.getPassword(username, workflow)
    .then((password) => {
    
    })
    .catch(() => {
        console.warn('Can not get password info! ');
    });
```

Allow to save/get password data securely.

### `setPassword(username, password, workflow)`
Set a password with username. It will return a promise.

### `getPassword(username, workflow)`
Get a password by username. It will return a promise.
