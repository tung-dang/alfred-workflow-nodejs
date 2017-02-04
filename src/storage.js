const nodePersist = require('node-persist');

class Storage {
    constructor() {
        nodePersist.initSync();
    }

    set(key, value, ttl) {
        const obj = {
            data: value,
            timestamp: new Date().getTime(),
            ttl: ttl || -1
        };

        nodePersist.setItemSync(key, obj);
    }

    get(key) {
        const obj = nodePersist.getItemSync(key);
        if (obj) {
            const ttl = obj.ttl;
            const timestamp = obj.timestamp;

            // if not ttl => return obj
            if (ttl === -1) {
                return obj.data;
            } else {
                // check ttl
                const now = new Date().getTime();
                if (now - timestamp < ttl) {
                    return obj.data;
                } else {
                    nodePersist.removeItemSync(key, function() {});
                }
            }
        }
    }

    remove(key) {
        if (nodePersist.getItem(key)) {
            nodePersist.removeItemSync(key, function() {});
        }
    }

    clear() {
        nodePersist.clearSync();
    }
}

module.exports = new Storage();