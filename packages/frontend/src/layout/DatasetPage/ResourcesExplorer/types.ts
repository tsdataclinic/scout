export type GithubResultType = 'CODE' | 'COMMIT';
export type GithubResultMetadata =
  | {
      type: 'CODE';
      codeFileLabel: string;
      codeFileURL: string;
    }
  | {
      type: 'COMMIT';
      commitLabel: string;
      commitDate: string;
      commitDescription: string | void;
      commitURL: string;
    };

export interface GithubResult {
  repoURL: string;
  repoLabel: string;
  metadata: GithubResultMetadata;
}
