"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var events = require("events");
var constants_1 = require("./constants");
var storage_1 = require("./storage");
var AfItem_1 = require("./AfItem");
var utilities_1 = require("./utilities");
var ACTION_NAMESPACE_EVENT = 'action';
var SUB_ACTION_NAMESPACE_EVENT = 'subActionSelected';
var AfWorkflow = /** @class */ (function () {
    function AfWorkflow( /* options: WorkflowOptions */) {
        var _this = this;
        /**
         * Add one feedback item
         */
        this.addItem = function (item) {
            _this._saveItemArg(item);
            _this._items.push(item.getAlfredItemData());
        };
        /**
         * Generating error feedback
         */
        this.error = function (title, subtitle) {
            if (subtitle === void 0) { subtitle = ''; }
            _this.log('Error: ', title, subtitle);
            _this.clearItems();
            _this.addItem(new AfItem_1["default"]({
                title: title,
                subtitle: subtitle,
                icon: constants_1.ICON_ERROR
            }));
            return _this.feedback();
        };
        this._items = [];
        this._name = 'AlfredWfNodeJs';
        this._eventEmitter = new events.EventEmitter();
        this._env = process.env;
        this._wfData = storage_1["default"].get(constants_1.WF_DATA_KEY) || {};
    }
    AfWorkflow._getActionName = function (action) {
        return ACTION_NAMESPACE_EVENT + "-" + action;
    };
    AfWorkflow._getSubActionName = function (action) {
        return SUB_ACTION_NAMESPACE_EVENT + "-" + action;
    };
    AfWorkflow.prototype.start = function () {
        var args = Array.prototype.slice.apply(this, arguments);
        var actionName;
        var query;
        if (args.length === 0) {
            actionName = process.argv[2];
            query = process.argv[3];
        }
        else {
            actionName = args[0];
            query = args[1];
        }
        this.log('- action name:"', actionName, '"');
        this.log('- query:"', query, '"');
        process.on('uncaughtException', this.error);
        this._trigger(actionName, this._sanitizeQuery(query));
    };
    /**
     * Add many feedback items
     */
    AfWorkflow.prototype.addItems = function (items) {
        items.forEach(this.addItem);
    };
    /**
     * Clear all feedback items
     */
    AfWorkflow.prototype.clearItems = function () {
        this._items = [];
    };
    /**
     * Set workflow name
     */
    AfWorkflow.prototype.setName = function (name) {
        this._name = name;
    };
    /**
     * Get workflow name
     */
    AfWorkflow.prototype.getName = function () {
        return this._name;
    };
    AfWorkflow.prototype.feedback = function (options) {
        var strOutput;
        try {
            if (!this._items.length) {
                this.error('No items in Workflow outputs!');
                return;
            }
            strOutput = JSON.stringify({
                items: this._items,
                rerun: options && options.rerun ? options.rerun : undefined
                // variables:
            }, null, '  ');
            // this.log('Workflow feedback: ');
            // fs.writeFileSync('test-json-_output.json', strOutput);
            this._output(strOutput);
            // this.clearItems();
            return strOutput;
        }
        catch (e) {
            this.log('Can not generate JSON string', this._items);
        }
        finally {
            storage_1["default"].set(constants_1.WF_DATA_KEY, this._wfData);
        }
        return strOutput;
    };
    /**
     * Generate info fedback
     */
    AfWorkflow.prototype.info = function (title, subtitle) {
        if (subtitle === void 0) { subtitle = ''; }
        this.clearItems();
        this.addItem(new AfItem_1["default"]({
            title: title,
            subtitle: subtitle,
            icon: constants_1.ICON_INFO
        }));
        return this.feedback();
    };
    /**
     * Generating warning feedback
     */
    AfWorkflow.prototype.warning = function (title, subtitle) {
        this.clearItems();
        this.addItem(new AfItem_1["default"]({
            title: title,
            subtitle: subtitle,
            icon: constants_1.ICON_WARNING
        }));
        return this.feedback();
    };
    /**
     * Show loading data
     */
    AfWorkflow.prototype.showLoading = function (title, subtitle) {
        this.clearItems();
        this.addItem(new AfItem_1["default"]({
            title: title || 'Loading',
            subtitle: subtitle || 'Fetching data...Please wait a little bit.',
            icon: constants_1.ICON_LOADING
        }));
        return this.feedback({
            rerun: 0.1
        });
    };
    /**
     * Register action handler
     */
    AfWorkflow.prototype.onAction = function (actionName, handler) {
        if (typeof actionName !== 'string' || typeof handler !== 'function') {
            console.error('ERROR - action and handler should be defined!');
            return;
        }
        this._eventEmitter.on(AfWorkflow._getActionName(actionName), handler);
    };
    /**
     * Register menu item selected handler
     */
    AfWorkflow.prototype.onSubActionSelected = function (actionName, handler) {
        if (!actionName || !handler) {
            console.error('ERROR - action and handler should be defined!');
            return;
        }
        this._eventEmitter.on(AfWorkflow._getSubActionName(actionName), handler);
    };
    AfWorkflow.prototype.log = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.isDebug()) {
            utilities_1.debug.apply(void 0, __spreadArrays([message], args));
        }
    };
    AfWorkflow.prototype.isDebug = function () {
        return !!this._env['alfred_debug'];
    };
    AfWorkflow.prototype.getConfig = function (key) {
        var value = this._env[key];
        if (!value) {
            this.log('Maybe you forget to set config for key=', key);
        }
        return value;
    };
    AfWorkflow.prototype._saveItemArg = function (item) {
        var data = item.getAlfredItemData();
        this._wfData[data.title] = data.arg;
    };
    AfWorkflow.prototype._getItemArg = function (itemTitle) {
        return this._wfData[itemTitle];
    };
    /**
     * Handle action by delegate to registered action/subAction handlers
     */
    AfWorkflow.prototype._trigger = function (actionName, query) {
        // handle first level action
        var isFirstLevelQuery = !query || query.indexOf(constants_1.SUB_ACTION_DIVIDER_SYMBOL) === -1;
        if (isFirstLevelQuery) {
            return this._eventEmitter.emit(AfWorkflow._getActionName(actionName), query);
        }
        // handle sub action
        var arrays = query.split(constants_1.SUB_ACTION_DIVIDER_SYMBOL);
        if (arrays.length >= 2) {
            query = this._sanitizeQuery(arrays[arrays.length - 1]);
            var previousTitleSelected = this._sanitizeQuery(arrays[arrays.length - 2]);
            var previousArgSelected = this._getItemArg(previousTitleSelected);
            previousArgSelected = this._convertToObjectIfPossible(previousArgSelected);
            this._eventEmitter.emit(AfWorkflow._getSubActionName(actionName), query, previousTitleSelected, previousArgSelected);
        }
    };
    AfWorkflow.prototype._sanitizeQuery = function (raw) {
        return typeof raw === 'string' ? raw.trim() : '';
    };
    AfWorkflow.prototype._convertToObjectIfPossible = function (str) {
        var result = str;
        try {
            if (typeof str === 'string') {
                result = JSON.parse(str);
            }
            return result;
        }
        catch (e) {
            this.log('Can not convert "', str, '" to object ');
        }
    };
    /* istanbul ignore next */
    AfWorkflow.prototype._output = function (str) {
        try {
            this.log('Workflow feedback: ');
            if (this.isDebug() || process.env.NODE_ENV === 'testing') {
                this.log(str);
            }
            console.log(str);
        }
        catch (e) {
            this.log('Can not generate JSON string', this._items);
        }
    };
    return AfWorkflow;
}());
exports["default"] = AfWorkflow;
