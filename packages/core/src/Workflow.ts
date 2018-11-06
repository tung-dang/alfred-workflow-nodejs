import * as events from 'events';
import {
  ICON_LOADING,
  ICON_ERROR,
  ICON_INFO,
  ICON_WARNING,
  SUB_ACTION_DIVIDER_SYMBOL,
  WF_DATA_KEY
} from './constants';
import storage from './storage';
import Item from './Item';
import { debug } from './utilities';
import {
  SubActionHandlerArg,
  AlfredItemType,
  AlfredResult,
  FeedbackOptions,
  // WorkflowOptions
} from './types';

const ACTION_NAMESPACE_EVENT = 'action';
const SUB_ACTION_NAMESPACE_EVENT = 'subActionSelected';

export default class Workflow {
  _items: AlfredItemType[];
  _name: string;
  _eventEmitter: events.EventEmitter;
  _env: any;
  _wfData: { [title: string]: any };

  constructor(/* options: WorkflowOptions */) {
    this._items = [];
    this._name = 'AlfredWfNodeJs';
    this._eventEmitter = new events.EventEmitter();
    this._env = process.env;
    this._wfData = storage.get(WF_DATA_KEY) || {};
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

    this.log('- action name:"', actionName, '"');
    this.log('- query:"', query, '"');

    process.on('uncaughtException', this.error);

    this._trigger(actionName, this._sanitizeQuery(query));
  }

  /**
   * Add one feedback item
   */
  addItem = (item: Item) => {
    this._saveItemArg(item);
    this._items.push(item.getAlfredItemData());
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

  feedback(options?: FeedbackOptions) {
    let strOutput;

    try {
      if (!this._items.length) {
        this.error('No items in Workflow outputs!');
        return;
      }

      strOutput = JSON.stringify(
        {
          items: this._items,
          rerun: options && options.rerun ? options.rerun : undefined
          // variables:
        } as AlfredResult,
        null,
        '  '
      );

      // this.log('Workflow feedback: ');
      // fs.writeFileSync('test-json-_output.json', strOutput);
      this._output(strOutput);
      // this.clearItems();

      return strOutput;
    } catch (e) {
      this.log('Can not generate JSON string', this._items);
    } finally {
      storage.set(WF_DATA_KEY, this._wfData);
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
        icon: ICON_INFO
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
        icon: ICON_WARNING
      })
    );

    return this.feedback();
  }

  /**
   * Generating error feedback
   */
  error = (title, subtitle = '') => {
    this.log('Error: ', title, subtitle);
    this.clearItems();
    this.addItem(
      new Item({
        title,
        subtitle,
        icon: ICON_ERROR
      })
    );

    return this.feedback();
  };

  /**
   * Show loading data
   */
  showLoading(title?: string, subtitle?: string) {
    this.clearItems();

    this.addItem(
      new Item({
        title: title || 'Loading',
        subtitle: subtitle || 'Fetching data...Please wait a little bit.',
        icon: ICON_LOADING
      })
    );

    return this.feedback({
      rerun: 0.1
    });
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
  onSubActionSelected(actionName: string, handler: SubActionHandlerArg) {
    if (!actionName || !handler) {
      console.error('ERROR - action and handler should be defined!');
      return;
    }

    this._eventEmitter.on(Workflow._getSubActionName(actionName), handler);
  }

  log(message, ...args) {
    if (this.isDebug()) {
      debug(message, ...args);
    }
  }

  isDebug(): boolean {
    return !!this._env['alfred_debug'];
  }

  getConfig(key: string): any {
    const value = this._env[key];
    if (!value) {
      this.log('Maybe you forget to set config for key=', key);
    }
    return value;
  }

  private _saveItemArg(item) {
    const data = item.getAlfredItemData();
    this._wfData[data.title] = data.arg;
  }

  private _getItemArg(itemTitle: string) {
    return this._wfData[itemTitle];
  }

  /**
   * Handle action by delegate to registered action/subAction handlers
   */
  private _trigger(actionName: string, query: string) {
    // handle first level action
    const isFirstLevelQuery =
      !query || query.indexOf(SUB_ACTION_DIVIDER_SYMBOL) === -1;
    if (isFirstLevelQuery) {
      return this._eventEmitter.emit(
        Workflow._getActionName(actionName),
        query
      );
    }

    // handle sub action
    const arrays = query.split(SUB_ACTION_DIVIDER_SYMBOL);
    if (arrays.length >= 2) {
      query = this._sanitizeQuery(arrays[arrays.length - 1]);
      const previousTitleSelected = this._sanitizeQuery(
        arrays[arrays.length - 2]
      );
      let previousArgSelected = this._getItemArg(previousTitleSelected);
      previousArgSelected = this._convertToObjectIfPossible(
        previousArgSelected
      );

      this._eventEmitter.emit(
        Workflow._getSubActionName(actionName),
        query,
        previousTitleSelected,
        previousArgSelected
      );
    }
  }

  private _sanitizeQuery(raw?: string): string {
    return typeof raw === 'string' ? raw.trim() : '';
  }

  private _convertToObjectIfPossible(str: string) {
    let result = str;
    try {
      if (typeof str === 'string') {
        result = JSON.parse(str);
      }

      return result;
    } catch (e) {
      this.log('Can not convert "', str, '" to object ');
    }
  }

  /* istanbul ignore next */
  private _output(str) {
    try {
      this.log('Workflow feedback: ');
      if (this.isDebug() || process.env.NODE_ENV === 'testing') {
        this.log(str);
      }
      console.log(str);
    } catch (e) {
      this.log('Can not generate JSON string', this._items);
    }
  }
}
