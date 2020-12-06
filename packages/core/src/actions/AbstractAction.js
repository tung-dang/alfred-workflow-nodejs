"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var AfItem_1 = require("../AfItem");
var AbstractAction = /** @class */ (function () {
    function AbstractAction(options) {
        if (options === void 0) { options = {}; }
        this.propertyName = options.propertyName || '';
    }
    AbstractAction.prototype.getDesc = function (arg) {
        return this._getPropValueByPropName(arg) || this.name;
    };
    AbstractAction.prototype.isValid = function (arg) {
        return !!this._getPropValueByPropName(arg);
    };
    AbstractAction.prototype._getPropValueByPropName = function (obj) {
        if (!this.propertyName) {
            return '';
        }
        var arr = this.propertyName.split('.');
        var prop = obj;
        for (var i = 0; i < arr.length; i++) {
            var propName = arr[i];
            prop = prop[propName];
        }
        return prop;
    };
    AbstractAction.prototype.execute = function (arg) {
        throw new Error('Should not call execute function of AbstractAction!' + arg);
    };
    AbstractAction.prototype.toAlfredItem = function (arg, extraOptions) {
        if (extraOptions === void 0) { extraOptions = {}; }
        return new AfItem_1["default"](__assign({ uid: this.key, title: this.name, subtitle: this.getDesc(arg), hasSubItems: false, icon: this.icon, arg: {
                actionKey: this.key,
                actionArg: arg
            } }, extraOptions));
    };
    return AbstractAction;
}());
exports["default"] = AbstractAction;
