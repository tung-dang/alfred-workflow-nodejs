export interface Executor {
  key: string;
  name: string;
  execute: (args: any) => void;
}
