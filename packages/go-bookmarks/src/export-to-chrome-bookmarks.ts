import fs from 'fs';

import {
  isShortenUrl,
  cleanProtocols,
  isCommentLine,
  getAddressAndTitle,
  isFolderPath,
} from './helpers';

export default class ExportChromeBookmarks {
  rawData: string;
  query: any;
  GO_LIST_FILE: string;
  EXCLUDED_WORDS: string[];
  output: string;

  constructor() {
    this.GO_LIST_FILE = 'go_list.txt';
    // some words will be excluded in parameter of search
    this.EXCLUDED_WORDS = 'issue-,issue/'.split(',');
    this.rawData = '';
    this.output = '';
  }

  start() {
    this.loadAllLinks();
  }

  _readLinkRepo() {
    return fs.readFileSync(this.GO_LIST_FILE, 'utf8');
  }

  loadAllLinks() {
    this.query = '';

    const rawData = this._readLinkRepo();

    this.output = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
      <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
      <TITLE>Bookmarks</TITLE>
      <H1>Bookmarks</H1>
      <DL><p>\n
      `

    const lines = rawData.split('\n');
    lines.forEach(this._processLine);

    this.output += '</DL><p>\n'

    fs.writeFileSync('exported_chrome_bookmark.html', this.output);
  };

  _processLine = line => {
    line = line.trim();
    if (!line || isCommentLine(line)) {
      return;
    }

    const { address, title } = getAddressAndTitle(
      line,
      '|'
    );

    const subtitle = this._getSubTitleFromAddress(address);
    const searchStr = this._getSearchStr(line);
    const isMatchSearch =
      title &&
      address &&
      (!searchStr || line.toLowerCase().indexOf(searchStr) >= 0);

    if (isMatchSearch) {
      let item;

      if (isFolderPath(line)) {
      } else {
        const finalLink = this._getFinalLink(address, subtitle);
        item = this._createNewLinkItem({ title, finalLink });
      }

      this.output += (item + `\n`);
    }
  };

  _createNewLinkItem({title, finalLink }) {
    return `<DT><A HREF="${finalLink}">${title}</A>`
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
    } else if (words.length > 1) {
      // remove last item
      words.pop();
      searchStr = words.join(' ');
    }

    return searchStr.toLowerCase();
  }

  _getFinalLink(address, subtitle) {
    let finalLink = 'https://';
    const isGoAddress = isShortenUrl(address);
    finalLink += isGoAddress ? address : subtitle;
    return finalLink;
  }

  /**
   * Last word is param. Now we just support only one param.
   */
  _getParamFromQuery() {
    const params: string[] = [];

    const words = this.query.split(' ');
    // remove last item
    const lastWord = words.pop();
    if (lastWord) {
      let param = lastWord.trim();
      this.EXCLUDED_WORDS.forEach(
        (excludeWord: string) => (param = param.replace(excludeWord, ''))
      );
      params.push(param);
    }

    return params;
  }

  _getSubTitleFromAddress = address => {
    let subTitle = address;

    const isGoAddress = isShortenUrl(address);
    if (isGoAddress) {
      subTitle = address.replace('go/', '');
    }

    // remove 'http://'
    subTitle = cleanProtocols(subTitle);
    // remove last /
    subTitle = subTitle.replace(/\/$/, '');

    return subTitle;
  };
}

const exportChromeBookmarks = new ExportChromeBookmarks();
exportChromeBookmarks.start()
