import storage from 'node-persist';

class Storage {
  constructor() {
    storage.initSync({
      ttl: true,
      stringify: data => {
        return JSON.stringify(data, null, '  ');
      }
    });
  }

  set(key, value, ttl?: number) {
    if (ttl) {
      storage.setItemSync(key, value, {
        ttl
      });
    } else {
      storage.setItemSync(key, value);
    }
  }

  get(key) {
    return storage.getItemSync(key);
  }

  remove(key) {
    storage.removeItemSync(key);
  }

  clear() {
    storage.clearSync();
  }

  setSetting(key, value) {
    let settings = this.get('settings');
    settings = settings || {};
    settings[key] = value;
    this.set('settings', settings);
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
}

const storageInstance = new Storage();
export default storageInstance;
