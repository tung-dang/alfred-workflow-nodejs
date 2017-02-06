const nodePersist = require('node-persist');

class Storage {
    constructor() {
        nodePersist.initSync();
    }

    set(key, value, ttl) {
        nodePersist.setItemSync(key, value, {
            ttl: ttl || -1
        });
    }

    get(key) {
        return nodePersist.getItemSync(key);
    }

    remove(key) {
        nodePersist.removeItemSync(key);
    }

    clear() {
        nodePersist.clearSync();
    }
}

module.exports = new Storage();