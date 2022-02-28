export interface CommitResult {
  repoLabel: string;
  repoURL: string;
  commitLabel: string;
  commitURL: string;
  commitDate: string;
  commitDescription: string;
}

export interface CodeResult {
  repoURL: string;
  repoLabel: string;
  codeFileLabel: string;
  codeFileURL: string;
}
