import * as events from 'events';
// import * as fs from 'fs';

import { SUB_ACTION_DIVIDER_SYMBOL } from './constants';
import storage from './storage';
import { ICONS, WF_DATA_KEY } from './constants';
import Item from './Item';
import { debug } from './utilities';
import { AlfredItem, AlfredResult } from "./types";

const ACTION_NAMESPACE_EVENT = 'action';
const SUB_ACTION_NAMESPACE_EVENT = 'subActionSelected';


export default class Workflow {
  _items: AlfredItem[];
  _name: string;
  _eventEmitter: events.EventEmitter;
  isDebug: boolean;

  constructor(options) {
    options = options || {};

    this._items = [];
    this._name = 'AlfredWfNodeJs';
    this._eventEmitter = new events.EventEmitter();
    this.isDebug = options.isDebug;
  }

  static _saveItemArg(item) {
    let wfData = storage.get(WF_DATA_KEY) || {};
    const data = item.getAlfredItemData();
    wfData[data.title] = data.arg;
    storage.set(WF_DATA_KEY, wfData);
  }

  static _getItemArg(itemTitle) {
    const wfData = storage.get(WF_DATA_KEY);
    return wfData ? wfData[itemTitle] : undefined;
  }

  static _getActionName(action) {
    return `${ACTION_NAMESPACE_EVENT}-${action}`;
  }

  static _getSubActionName(action) {
    return `${SUB_ACTION_NAMESPACE_EVENT}-${action}`;
  }

  start() {
    const args = Array.prototype.slice.apply(this, arguments);
    let actionName;
    let query;

    if (args.length === 0) {
      actionName = process.argv[2];
      query = process.argv[3];
    } else {
      actionName = args[0];
      query = args[1];
    }

    process.on('uncaughtException', this.error);

    this._trigger(actionName, query);
  }

  /**
   * Add one feedback item
   */
  addItem = (item: Item) => {
    if (item instanceof Item) {
      Workflow._saveItemArg(item);
      this._items.push(item.getAlfredItemData());
    } else {
      this.error('ERROR: item is not an instance of Item class!');
    }
  };

  /**
   * Add many feedback items
   */
  addItems(items) {
    items.forEach(this.addItem);
  }

  /**
   * Clear all feedback items
   */
  clearItems() {
    this._items = [];
  }

  /**
   * Set workflow name
   */
  setName(name) {
    this._name = name;
  }

  /**
   * Get workflow name
   */
  getName() {
    return this._name;
  }

  /**
   * Generate feedback as this structure
   * ```
   * {
   *    "items": [
            {
                "uid": "desktop",
                "type": "file",
                "title": "Desktop",
                "subtitle": "~/Desktop",
                "arg": "~/Desktop",
                "autocomplete": "Desktop",
                "icon": {
                    "type": "fileicon",
                    "path": "~/Desktop"
                }
            }
        ]
    }
   ```
   *
   */
  feedback(strFeedback?: string) {
    let strOutput = '';

    try {
      if (strFeedback) {
        strOutput = strFeedback;
      } else {
        strOutput = JSON.stringify(
          {
            items: this._items
            // rerun:
            // variables:
          } as AlfredResult,
          null,
          '  '
        );
      }

      debug('Workflow feedback: ');
      // fs.writeFile('test-json-_output.json', strOutput);
      this._output(strOutput);
      this.clearItems();

      return strOutput;
    } catch (e) {
      debug('Can not generate JSON string', this._items);
    }

    return strOutput;
  }

  /**
   * Generate info fedback
   */
  info(title, subtitle = '') {
    this.clearItems();
    this.addItem(
      new Item({
        title,
        subtitle,
        valid: true,
        hasSubItems: false,
        icon: ICONS.INFO
      })
    );

    return this.feedback();
  }

  /**
   * Generating warning feedback
   */
  warning(title, subtitle) {
    this.clearItems();
    this.addItem(
      new Item({
        title,
        subtitle,
        valid: true,
        hasSubItems: false,
        icon: ICONS.WARNING
      })
    );

    return this.feedback();
  }

  /**
   * Generating error feedback
   */
  error(title, subtitle = '') {
    debug('Error: ', title, subtitle);
    this.clearItems();
    this.addItem(
      new Item({
        title,
        subtitle,
        valid: true,
        hasSubItems: false,
        icon: ICONS.ERROR
      })
    );

    return this.feedback();
  }

  /**
   * Show loading data
   */
  showLoading() {
    this.clearItems();

    this.addItem(
      new Item({
        title: 'Loading',
        subtitle: '...??',
        icon: ICONS.CLOCK
      })
    );

    return this.feedback();
  }

  /**
   * Register action handler
   */
  onAction(actionName, handler) {
    if (typeof actionName !== 'string' || typeof handler !== 'function') {
      console.error('ERROR - action and handler should be defined!');
      return;
    }

    this._eventEmitter.on(Workflow._getActionName(actionName), handler);
  }

  /**
   * Register menu item selected handler
   */
  onSubActionSelected(actioName, handler) {
    if (!actioName || !handler) {
      console.error('ERROR - action and handler should be defined!');
      return;
    }

    this._eventEmitter.on(Workflow._getSubActionName(actioName), handler);
  }

  /**
   * Handle action by delegate to registered action/subAction handlers
   */
  _trigger(actionName, query) {
    const tempQuery = this._sanitizeQuery(query);

    // handle first level action
    if (
      !tempQuery ||
      typeof tempQuery === 'object' ||
      (typeof tempQuery === 'string' &&
        tempQuery.indexOf(SUB_ACTION_DIVIDER_SYMBOL) === -1)
    ) {
      this._eventEmitter.emit(
        Workflow._getActionName(actionName),
        tempQuery
      );
      return;
    }

    // handle sub action
    const arrays = tempQuery.split(SUB_ACTION_DIVIDER_SYMBOL);

    if (arrays.length >= 2) {
      const previousActionTitleSelected = this._sanitizeQuery(
        arrays[arrays.length - 2]
      );
      query = this._sanitizeQuery(arrays[arrays.length - 1]); // last string is query

      let previousArgActionSelected = Workflow._getItemArg(
        previousActionTitleSelected
      );
      try {
        previousArgActionSelected = JSON.parse(previousArgActionSelected);
      } catch (e) {
        debug('Can not convert arg string into Object!');
      }

      this._eventEmitter.emit(
        Workflow._getSubActionName(actionName),
        query,
        previousActionTitleSelected,
        previousArgActionSelected
      );
    }
  }

  /**
   * Clear everything.
   */
  destroy() {
    this._items = [];
    this._name = '';
    this._eventEmitter.removeAllListeners();
    storage.clear();
  }

  _sanitizeQuery(rawQuery) {
    let finalQuery = rawQuery;

    try {
      finalQuery = JSON.parse(rawQuery);
    } catch (e) {
      // can not parse to object, we keep it as string
      finalQuery = rawQuery;
    }

    finalQuery = finalQuery && finalQuery.trim ? finalQuery.trim() : finalQuery;
    return finalQuery;
  }

  /* istanbul ignore next */
  _output(str) {
    try {
      debug('Workflow feedback: ');
      if (this.isDebug || process.env.NODE_ENV === 'testing') {
        debug(str);
      } else {
        console.log(str);
      }
    } catch (e) {
      debug('Can not generate JSON string', this._items);
    }
  }
}
