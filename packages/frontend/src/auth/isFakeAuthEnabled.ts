/**
 * Checks if the REACT_APP_USE_FAKE_AUTH environment variable
 * was set to anything. If the env var is missing or 'false' then
 * we return `false`
 */
export default function isFakeAuthEnabled(): boolean {
  return (
    process.env.REACT_APP_USE_FAKE_AUTH !== 'false' &&
    process.env.REACT_APP_USE_FAKE_AUTH !== undefined &&
    process.env.REACT_APP_USE_FAKE_AUTH !== null
  );
}
