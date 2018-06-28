import { ICON_DEFAULT, SUB_ACTION_DIVIDER_SYMBOL } from './constants';
import { AlfredItemType } from './types';

/**
 * Each item describes a result row displayed in Alfred.
 * All props of an item are described here: https://www.alfredapp.com/help/workflows/inputs/script-filter/json/
 */
export default class Item {
  _data: AlfredItemType;

  constructor(options: AlfredItemType) {
    if (!options.title) {
      throw new Error('Title is required!');
    }

    const tempData: AlfredItemType = {
      uid: options.uid || options.title,
      arg: options.arg ? this._hygieneArg(options.arg) : undefined,
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
      hasSubItems: !!options.hasSubItems, // default: false
      match: options.match || options.title + ' | ' + options.subtitle
    };

    if (tempData.hasSubItems) {
      tempData.valid = false;
    } else {
      tempData.valid =
        typeof options.valid === 'undefined' ? true : options.valid;
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
      path: ICON_DEFAULT
    };
  }

  /**
   * Get value of an item by key
   * @param key
   */
  get(key: string) {
    return this._data[key];
  }

  /**
   * Get internal data object
   */
  getAlfredItemData(): AlfredItemType {
    return this._data;
  }

  /**
   * `arg` props is passed as an object and we need to convert it to string type so that Alfred can understand.
   * @param arg
   * @returns {String}
   * @private
   */
  _hygieneArg(arg: object | string): string {
    if (typeof arg === 'object') {
      return JSON.stringify(arg);
    }

    if (typeof arg === 'string') {
      return arg;
    }

    return '';
  }
}
