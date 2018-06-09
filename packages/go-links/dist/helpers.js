"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("../config.json");
const SEPARATOR = config['separator'];
exports.EXECUTOR_OPEN_IN_FINDER = 'open_in_finder';
exports.EXECUTOR_OPEN_LINK = 'open_link';
function cleanProtocols(url) {
    const SPLIT_PROTOCOL = '://';
    if (url.includes(SPLIT_PROTOCOL)) {
        return url.split(SPLIT_PROTOCOL)[1];
    }
    return url;
}
exports.cleanProtocols = cleanProtocols;
function isShortenUrl(url) {
    return cleanProtocols(url).startsWith('go/');
}
exports.isShortenUrl = isShortenUrl;
function isCommentLine(str) {
    return str.trim().startsWith('#');
}
exports.isCommentLine = isCommentLine;
function getAddressAndTitle(str) {
    const temp = str.split(SEPARATOR);
    return {
        address: temp[0],
        title: temp[1]
    };
}
exports.getAddressAndTitle = getAddressAndTitle;
function isFolderPath(str) {
    if (str.startsWith('/') || str.startsWith('~')) {
        return true;
    }
    return false;
}
exports.isFolderPath = isFolderPath;
