export type FolderInfo = {
  name: string;
  path: string;
};

export type ProjectType = 'java' | 'nodejs';
export type ProjectInfo = {
  projectType: ProjectType;
  path?: string;
  gitInfo?: GitInfo;
};

export type GitInfo = {
  server: string;
  repo: string;
  project: string;
  branch: string;
  url: string;
  link: string;
  prsLink: string;
  prLink: string;
  createPrLink: string;
  gitRootPath: string;
};

export type CommandParams = {
  // key: string;
  name: string;
  path: string;
  gitInfo?: GitInfo;
  projectType: ProjectType;
};

export type ProjectActionArg = {
  actionKey: string;
  actionArg: CommandParams;
};
