### Utils - Helper functions
Some utilities

* filter(query, list, keyBuilder) : filter list of object using fuzzy matching
    * query
    * list
    * keyBuilder : function to build key to compare from items in list

```js
var utils = AlfredNode.utils;
// filter array of string/object using fuzzy matching
utils.filter("a", ["a", "b", "c"], function(item){return item});
// => return ["a"]
utils.filter("pen", [{name: "pencil"}, {name: "pen"}, {name: "book"}], function(item){ return item.name});
// => return [{name: "pencil"}, {name: "pen"}]
```

* generateVars: set variables via script output (see "Setting variables" section above for usage)
* envVars: methods for enviroment variables
    * set(key, value) - value can be string or object. If value is object, it is stored as json string
    * get(key) - if stored value is object, this method will parse json string to object and return
* wfVars: methods for workflow variables
    * set(key, value, [callback])
        * key: variable name
        * value: need to be string **(object value is not supported)**
        * callback: callback(error) - optional
    * get(key, callback)
        * key: variable name
        * callback: callback(error, value)
    * remove(key, callback)
        * key: variable name
        * callback: callback(error) - optional
    * clear(key, callback) - **Clear all** wf variables
        * key: variable name
        * callback: callback(error) - optional

### Icons - Some built-in icons
Icons are from "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources"

```js
AlfredNode.ICONS.ERROR
AlfredNode.ICONS.INFO
```
See more in `src/constants.js`