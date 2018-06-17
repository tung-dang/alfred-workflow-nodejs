export type Folder = {
  path: string;
  name: string;
};

export type GroupPackage = Folder & {
  children: Package[];
};

export type Package = Folder & {
  groupName: string;
  version?: string;
};

export type PackageActionArg = {
  localFullPage: string;
  docLink: string;
};

export type ExecuteActionArg = {
  actionKey: string;
  actionArg?: PackageActionArg | string;
};

export type PackageAction = {
  key: string;
  name: string;
  getDesc?: (arg: PackageActionArg) => void;
  icon: string;
  execute: (arg: PackageActionArg | string) => void;
};
