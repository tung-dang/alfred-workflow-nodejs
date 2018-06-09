import * as config from '../config.json';
const SEPARATOR = config['separator'];

export const EXECUTOR_OPEN_IN_FINDER = 'open_in_finder';
export const EXECUTOR_OPEN_LINK = 'open_link';

export function cleanProtocols(url: string) {
  const SPLIT_PROTOCOL = '://';
  if (url.includes(SPLIT_PROTOCOL)) {
    return url.split(SPLIT_PROTOCOL)[1];
  }

  return url;
}

export function isShortenUrl(url: string) {
  return cleanProtocols(url).startsWith('go/');
}

export function isCommentLine(str: string) {
  return str.trim().startsWith('#');
}

export function getAddressAndTitle(str: string) {
  const temp = str.split(SEPARATOR);

  return {
    address: temp[0],
    title: temp[1]
  };
}

export function isFolderPath(str: string) {
  if (str.startsWith('/') || str.startsWith('~')) {
    return true;
  }

  return false;
}
