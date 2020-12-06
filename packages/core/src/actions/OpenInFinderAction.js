"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var child_process_1 = require("child_process");
var path = require("path");
var AbstractAction_1 = require("./AbstractAction");
var OpenInFinderAction = /** @class */ (function (_super) {
    __extends(OpenInFinderAction, _super);
    function OpenInFinderAction(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        _this.key = options.key || 'open_in_finder';
        _this.name = options.name || 'Open in Finder';
        _this.icon =
            options.icon || path.resolve(__dirname, '../../icons/finder.png');
        _this.propertyName = options.propertyName || 'path';
        return _this;
    }
    OpenInFinderAction.prototype.execute = function (arg) {
        var command;
        if (typeof arg === 'string') {
            command = "open " + arg;
        }
        else {
            command = "open " + this._getPropValueByPropName(arg);
        }
        return child_process_1.exec(command);
    };
    return OpenInFinderAction;
}(AbstractAction_1["default"]));
exports["default"] = OpenInFinderAction;
