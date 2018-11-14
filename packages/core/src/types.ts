import AfItem from './AfItem';

export type AlfredIconType = {
  type?: 'filetype' | 'fileicon';
  path: string;
};

export type ModType = {
  valid: boolean;
  arg: any;
  subtitle: string;
  icon: AlfredIconType;
  variables: any;
};

// Reference from: https://www.alfredapp.com/help/workflows/inputs/script-filter/json/
export type AlfredItemType = {
  uid?: string;
  title: string;
  subtitle?: string;
  type?: 'default' | 'file' | 'file:skipcheck';
  arg?: object | string;
  autocomplete?: string;
  quicklookurl?: string;
  icon?: AlfredIconType | string;
  text?: string;
  mods?: {
    alt?: ModType;
    cmd?: ModType;
  };
  valid?: boolean;
  match?: string;
  hasSubItems?: boolean;
};

export type AlfredResult = {
  rerun?: number;
  variables?: object;
  items: AlfredItemType[];
};

export type FeedbackOptions = {
  rerun?: number;
};

export type SubActionArg = {
  query: string;
  previousTitleSelected: string;
  previousArgSelected: any;
};

export type SubActionHandlerArg = (
  query: string,
  previousTitleSelected: string,
  previousArgSelected: any
) => void;

export interface IAction {
  key: string;
  name: string;
  getDesc?: (arg: any) => string;
  icon: string;
  execute: (arg?: any) => void;
  isValid: (arg: any) => boolean;
  toAlfredItem: (arg: any) => AfItem;
}

export interface IActionOption {
  key?: string;
  name?: string;
  propertyName?: string;
  icon?: string;
}

export type WorkflowOptions = {
};
