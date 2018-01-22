const config = require('../config.json');
const SEPARATOR = config['separator'];

const exportModule = {
    EXECUTOR_OPEN_IN_FINDER: 'open_in_finder',
    EXECUTOR_OPEN_LINK: 'open_link',

    cleanProtocols(url) {
        const SPLIT_PROTOCOL = '://';
        if (url.includes(SPLIT_PROTOCOL)) {
            return url.split(SPLIT_PROTOCOL)[1];
        }

        return url;
    },

    isShortenUrl(url){
        return exportModule.cleanProtocols(url).startsWith('go/');
    },

    isCommentLine(str) {
        return str.trim().startsWith('#');
    },

    getAddressAndTitle(str) {
        const temp = str.split(SEPARATOR);

        return {
            address: temp[0],
            title: temp[1],
        };
    },

    isFolderPath(str) {
        if (str.startsWith('/') || str.startsWith('~')) {
            return true;
        }

        return false;
    }
};

module.exports = exportModule;