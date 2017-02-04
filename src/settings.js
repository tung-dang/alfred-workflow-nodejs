const keychain = require('keychain');
const storage = require('./storage');
// const Workflow = require('./Workflow');

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

    // setPassword: function(username, password) {
    //     keychain.setPassword({
    //         account: username,
    //         service: workflow.getName(),
    //         password: password
    //     }, function(err) {
    //         console.log(err);
    //     });
    // },

    // getPassword: function(username, callback) {
    //     keychain.getPassword({
    //         account: username,
    //         service: workflow.getName()
    //     }, callback);
    // }
};

module.exports = settings;
