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
var OpenInVSCodeAction = /** @class */ (function (_super) {
    __extends(OpenInVSCodeAction, _super);
    function OpenInVSCodeAction(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        _this.key = options.key || 'open_in_vscode';
        _this.name = options.name || 'Open in Visual Studio Code';
        _this.icon =
            options.icon || path.resolve(__dirname, '../../icons/vscode.jpg');
        _this.propertyName = options.propertyName || 'path';
        return _this;
    }
    OpenInVSCodeAction.prototype.execute = function (arg) {
        var command;
        var vsCodePath = '/usr/local/bin/code';
        var vsCodeOptions = '--new-window';
        if (typeof arg === 'string') {
            command = vsCodePath + " " + vsCodeOptions + " " + arg;
        }
        else {
            command = vsCodePath + " " + vsCodeOptions + " " + this._getPropValueByPropName(arg);
        }
        return child_process_1.exec(command);
    };
    return OpenInVSCodeAction;
}(AbstractAction_1["default"]));
exports["default"] = OpenInVSCodeAction;
