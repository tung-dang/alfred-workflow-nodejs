const keychain = require('keychain');
const storage = require('./storage');

const settings =  {
    set: function(key, value) {
        let settings = storage.get('settings');
        settings = settings || {};
        settings[key] = value;
        storage.set('settings', settings);
    },

    get: function(key) {
        const settings = storage.get('settings');
        if (settings) {
            return settings[key];
        }
    },

    remove: function(key) {
        const settings = storage.get('settings');
        if (settings) {
            delete settings[key];
        }
    },

    clear: function() {
        storage.remove('settings');
    },

    setPassword: function(username, password, workflow) {
        if (!username || !password || !workflow) {
            console.error('Invalid arguments: userName, password or workflow!');
            return;
        }

        keychain.setPassword({
            account: username,
            service: workflow.getName(),
            password: password
        }, function(err) {
            console.log(err);
        });
    },

    /**
     * @param username
     * @param workflow
     */
    getPassword: function(username, workflow) {
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
                    return;
                }

                resolve(password);
            });
        });

        return p;
    }
};

module.exports = settings;
