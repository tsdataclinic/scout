import util from 'util';

/**
 * Helper function to nicely console log a deeply nested object.
 * console.log isn't create at logging deeply nested objects,
 * so we use `util.inspect` to do a better job.
 */
function consoleLogObject(msg: string, obj: unknown): void;
function consoleLogObject(obj: unknown): void;
function consoleLogObject(msg: string, obj?: unknown): void {
  const prettyOutput = util.inspect(obj, {
    showHidden: false,
    depth: null,
    colors: true,
  });

  if (arguments.length === 1) {
    console.log(prettyOutput);
  } else {
    console.log(msg, prettyOutput);
  }
}

export default consoleLogObject;
