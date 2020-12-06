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
var path = require("path");
var clipboardy = require("clipboardy");
var AbstractAction_1 = require("./AbstractAction");
var CopyToClipboardAction = /** @class */ (function (_super) {
    __extends(CopyToClipboardAction, _super);
    function CopyToClipboardAction(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        _this.key = options.key || 'copy_to_clipboard';
        _this.name = options.name || 'Copy link to clipboard';
        _this.icon =
            options.icon || path.resolve(__dirname, '../../icons/copy.png');
        _this.propertyName = options.propertyName || 'link';
        return _this;
    }
    CopyToClipboardAction.prototype.execute = function (arg) {
        clipboardy.writeSync(typeof arg === 'string'
            ? arg
            : this._getPropValueByPropName(arg));
    };
    return CopyToClipboardAction;
}(AbstractAction_1["default"]));
exports["default"] = CopyToClipboardAction;
