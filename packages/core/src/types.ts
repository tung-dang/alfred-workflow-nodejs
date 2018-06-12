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
export type AlfredItem = {
  uid?: string;
  title: string;
  subtitle?: string;
  type?: 'default' | 'file' | 'file:skipcheck';
  arg?: string;
  autocomplete?: string;
  quicklookurl?: string;
  icon: AlfredIconType | string;
  text?: string;
  mods?: {
    alt?: ModType;
    cmd?: ModType;
  };
  valid?: boolean;
  hasSubItems?: boolean;
};

export type AlfredResult = {
  rerun?: number;
  variables?: object;
  items: AlfredItem[];
};
