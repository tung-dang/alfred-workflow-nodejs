# Setting variables

* Set variables via script output

```js
AlfredNode.utils.generateVars({arg: 'xyz', variables: {key: value}};

// output
'{"alfredworkflow": {"arg": "xyz", "variables": {"key": "value"}}}'
```

* Set variables via wf feedback item

```js
const AlfredNode = require('alfred-workflow-nodejs');
const Item = AlfredNode.Item;
const item = new Item({
    title: "item 1", 
    arg: {
        arg: 'xyz', variables: {key: value}
    }
});
workflow.addItem(item);
workflow.feedback();

// output:
{"items": [
    {
     "title": "item 1",
     "arg": "{\"alfredworkflow\": {\"arg\": \"xyz\", \"variables\": {\"key\": \"value\"}}}"
     }
]}
```

### settings - APIs to CRUD settings
Helpers to store string key/value settings, store password into Mac keychain

* set(key, value, [ttl])
    * key: string
    * value: string
* get(key)
* remove(key)
* clear() : clear all settings, be carefull!!!
* setPassword(username, password) : store password to Mac keychain (workflow name is used here as keychain service)
* getPassword(username, callback(error,password)) : get password of username from Mac keychain
    * username
    * callback(error, password): callback function that is called after password is returned
