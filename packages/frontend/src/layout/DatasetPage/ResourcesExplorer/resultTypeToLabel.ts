import { GithubResultType } from './types';
import assertUnreachable from '../../../utils/assertUnreachable';

export default function resultTypeToLabel(type: GithubResultType): string {
  switch (type) {
    case 'CODE':
      return 'Code';
    case 'COMMIT':
      return 'Commits';
    default:
      assertUnreachable(type, { throwError: false });
      return type;
  }
}
