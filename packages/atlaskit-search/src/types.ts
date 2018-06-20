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
