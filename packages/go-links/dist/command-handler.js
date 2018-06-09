"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const alfred_workflow_nodejs_next_1 = require("alfred-workflow-nodejs-next");
const config = require("../config.json");
const helpers_1 = require("./helpers");
const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;
const GO_LIST_FILE = config['go_link_file_name'];
// some words will be excluded in parameter of search
const EXCLUDED_WORDS = config['exclude_words'];
class CommandHandler {
    constructor(options) {
        this.loadAllLinks = (query) => {
            this.query = query ? query.trim() : '';
            const rawData = this._readLinkRepo();
            const lines = rawData.split('\n');
            lines.forEach(this._processLine);
            this.workflow.feedback();
        };
        this._processLine = (line) => {
            line = line.trim();
            if (!line || helpers_1.isCommentLine(line)) {
                return;
            }
            const { address, title } = helpers_1.getAddressAndTitle(line);
            const subtitle = this._getSubTitleFromAddress(address);
            const searchStr = this._getSearchStr(line);
            const isMatchSearch = title &&
                address &&
                (!searchStr || line.toLowerCase().indexOf(searchStr) >= 0);
            if (isMatchSearch) {
                let item;
                if (helpers_1.isFolderPath(line)) {
                    item = this._createNewPathItem({
                        address,
                        title,
                        subtitle,
                        folderPath: address
                    });
                }
                else {
                    const finalLink = this._getFinalLink(address, subtitle);
                    item = this._createNewLinkItem({ address, title, subtitle, finalLink });
                }
                this.workflow.addItem(item);
            }
        };
        this._getSubTitleFromAddress = (address) => {
            let subTitle = address;
            const isGoAddress = helpers_1.isShortenUrl(address);
            if (isGoAddress) {
                subTitle = address.replace('go/', '');
            }
            // remove 'http://'
            subTitle = helpers_1.cleanProtocols(subTitle);
            // remove last /
            subTitle = subTitle.replace(/\/$/, '');
            return subTitle;
        };
        this.workflow = options.workflow;
        this.rawData = '';
    }
    _readLinkRepo() {
        // this.rawData = storage.get('rawData');
        // if (!this.rawData) {
        // console.warn('INFO: read go_list.txt file');
        this.rawData = fs.readFileSync(GO_LIST_FILE, 'utf8');
        // } else {
        //     console.warn('INFO: get data from cache');
        // }
        if (!this.rawData) {
            this.workflow.error('Error', 'Can not load go_list.txt file');
            return '';
        }
        // storage.set('rawData', this.rawData, ONE_DAY);
        return this.rawData;
    }
    _createNewLinkItem({ address, title, subtitle, finalLink }) {
        const item = new alfred_workflow_nodejs_next_1.Item({
            uid: address,
            title,
            subtitle,
            hasSubItems: false,
            arg: {
                actionName: helpers_1.EXECUTOR_OPEN_LINK,
                link: finalLink,
                params: this._getParamFromQuery()
            }
        });
        return item;
    }
    _createNewPathItem({ address, title, subtitle, folderPath }) {
        const item = new alfred_workflow_nodejs_next_1.Item({
            uid: address,
            title,
            subtitle,
            hasSubItems: false,
            arg: {
                actionName: helpers_1.EXECUTOR_OPEN_IN_FINDER,
                folderPath
            }
        });
        return item;
    }
    /**
     * After excluding last word, the remaining is search string
     * @return {string} [description]
     */
    _getSearchStr(line) {
        const hasParameter = line.includes('{') && line.includes('}');
        if (!hasParameter) {
            return this.query;
        }
        let searchStr = '';
        const words = this.query.split(' ');
        if (words.length === 1) {
            searchStr = this.query;
        }
        else if (words.length > 1) {
            // remove last item
            words.pop();
            searchStr = words.join(' ');
        }
        return searchStr.toLowerCase();
    }
    _getFinalLink(address, subtitle) {
        let finalLink = 'https://';
        const isGoAddress = helpers_1.isShortenUrl(address);
        finalLink += isGoAddress ? address : subtitle;
        return finalLink;
    }
    /**
     * Last word is param. Now we just support only one param.
     */
    _getParamFromQuery() {
        const params = [];
        const words = this.query.split(' ');
        // remove last item
        const lastWord = words.pop();
        if (lastWord) {
            let param = lastWord.trim();
            EXCLUDED_WORDS.forEach(excludeWord => (param = param.replace(excludeWord, '')));
            params.push(param);
        }
        return params;
    }
}
exports.default = CommandHandler;
