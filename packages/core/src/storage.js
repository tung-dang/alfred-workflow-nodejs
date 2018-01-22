const keychain = require('keychain');
const nodePersist = require('node-persist');

class Storage {
    constructor() {
        nodePersist.initSync({
            ttl: true
        });
    }

    set(key, value, ttl) {
        nodePersist.setItemSync(key, value, {
            ttl
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

    setSetting(key, value) {
        let settings = this.get('settings');
        settings = settings || {};
        settings[key] = value;
        this.set('settings', settings, false);
    }

    getSetting(key) {
        const settings = this.get('settings');
        if (settings) {
            return settings[key];
        }
    }

    removeSetting(key) {
        const settings = this.get('settings');
        if (settings) {
            delete settings[key];
        }
    }

    clearSetting() {
        this.remove('settings');
    }

    setPassword(username, password, workflow) {
        if (!username || !password || !workflow) {
            console.error('Invalid arguments: userName, password or workflow!');
            return;
        }

        keychain.setPassword({
            account: username,
            service: workflow.getName(),
            password: password
        }, function(err) {
            console.warn('Can not set password: ', err);
        });
    }

    /**
     * @param {String} username
     * @param {Workflow} workflow - on object of Workflow object
     */
    getPassword(username, workflow) {
        const p = new Promise((resolve, reject) => {
            if (!username || !workflow) {
                console.error('Invalid arguments: userName or workflow!');
                reject();
                return;
            }

            keychain.getPassword({
                account: username,
                service: workflow.getName()
            }, (error, password) => {
                if (error) {
                    workflow.error('ERROR', 'Can not get password data');
                    reject();
                    return;
                }

                resolve(password);
            });
        });

        return p;
    }
}

module.exports = new Storage();