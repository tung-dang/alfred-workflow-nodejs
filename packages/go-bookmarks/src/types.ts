export interface Executor {
  actionName?: string;
  key?: string;
  execute: (args: any) => void;
}
