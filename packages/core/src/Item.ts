import * as path from 'path';
import { SUB_ACTION_DIVIDER_SYMBOL } from './constants';
import { AlfredItem } from './types';

/**
 * Each item describes a result row displayed in Alfred.
 * All props of an item are described here: https://www.alfredapp.com/help/workflows/inputs/script-filter/json/
 */
export default class Item {
  _data: AlfredItem;

  constructor(options: AlfredItem) {
    if (!options.title) {
      throw new Error('Title is required!');
    }

    const tempData: AlfredItem = {
      uid: options.uid || options.title,
      arg: this._hygieneArg(options.arg),
      autocomplete: options.autocomplete,
      title: options.title,
      subtitle: options.subtitle || '',
      type: options.type || 'default',
      icon:
        typeof options.icon === 'string'
          ? {
              path: options.icon
            }
          : options.icon,
      quicklookurl: options.quicklookurl,
      text: options.text,
      mods: options.mods,
      valid: options.valid || true,
      hasSubItems: !!options.hasSubItems // default: false
    };

    if (tempData.hasSubItems) {
      tempData.valid = false;
    }

    if (tempData.hasSubItems) {
      tempData.autocomplete = `${tempData.title} ${SUB_ACTION_DIVIDER_SYMBOL} `;
    }

    if (tempData.mods) {
      for (let key in tempData.mods) {
        const obj = tempData.mods[key];
        if (typeof obj.arg !== 'string') {
          obj.arg = this._hygieneArg(obj.arg);
        }
      }
    }

    if (!tempData.icon) {
      tempData.icon = this._getDefaultIcon();
    }

    this._data = tempData;
  }

  _getDefaultIcon() {
    return {
      path: path.resolve(__dirname, '../alfred-icon.png')
    };
  }

  /**
   * Get value of an item by key
   * @param key
   */
  get(key) {
    return this._data[key];
  }

  /**
   * Get internal data object
   */
  getAlfredItemData() {
    return this._data;
  }

  /**
   * `arg` props is passed as an object and we need to convert it to string type so that Alfred can understand.
   * @param arg
   * @returns {String}
   * @private
   */
  _hygieneArg(arg) {
    if (typeof arg === 'object') {
      return JSON.stringify(arg);
    }

    if (typeof arg === 'string') {
      return arg;
    }

    return '';
  }
}
