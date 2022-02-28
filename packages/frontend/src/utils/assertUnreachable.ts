function assertUnreachable(x: never): never;
function assertUnreachable(x: never, options: { throwError: true }): never;
function assertUnreachable(x: never, options: { throwError: false }): void;
function assertUnreachable(x: never, options?: { throwError: boolean }): void {
  if (!options || (options && options.throwError)) {
    if (typeof x === 'string') {
      throw new Error(`This should have been unreachable. Received '${x}'`);
    }
    throw new Error('This should have been unreachable.');
  }
}

export default assertUnreachable;
