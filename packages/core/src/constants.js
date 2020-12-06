"use strict";
exports.__esModule = true;
exports.ICON_LOADING = exports.ICON_INFO = exports.ICON_WARNING = exports.ICON_ERROR = exports.ICON_DEFAULT = exports.WF_DATA_KEY = exports.SUB_ACTION_DIVIDER_SYMBOL = void 0;
var path = require("path");
exports.SUB_ACTION_DIVIDER_SYMBOL = '➤';
exports.WF_DATA_KEY = 'wfData';
exports.ICON_DEFAULT = process.env.NODE_ENV === 'testing'
    ? 'ICON_DEFAULT'
    : path.resolve(__dirname, '../icons/alfred-icon.png');
exports.ICON_ERROR = process.env.NODE_ENV === 'testing'
    ? 'ICON_ERROR'
    : path.resolve(__dirname, '../icons/error.png');
exports.ICON_WARNING = path.resolve(__dirname, '../icons/warning.png');
exports.ICON_INFO = path.resolve(__dirname, '../icons/info.png');
exports.ICON_LOADING = path.resolve(__dirname, '../icons/loading.png');
