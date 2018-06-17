export interface Executor {
  actionName: string;
  execute: (args: any) => void;
}
