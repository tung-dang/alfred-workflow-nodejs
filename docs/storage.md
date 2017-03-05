### Storage - APIs to CRUD data
* set(key, value, [ttl])
* key: string
* value: string/object
* ttl: long (milisecond) // time to live
* get(key)
* remove(key)
* clear() : clear all data, be carefull!!!

    ```js
var storage = AlfredNode.storage;
storge.set("key", "value");
storage.set("key", {name: "node"}, 1000);
storage.get("key");
storage.remove("key");
storage.clear();
```

