export interface Executor {
  actionName: string;
  execute: (args: any) => void;
}

export interface FileItem {
  name: string;
  html_url: string;
  path: string;
  type?: 'file'
};
