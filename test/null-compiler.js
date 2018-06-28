//TODO: UNduplicate

/**
 * This file is used by mocha to null out SCSS files so that they don't cause errors in tests. We may be able to change
 * this to a compilation step so that we can unit test styles from SCSS files in javascript.
 *
 * @example
 * mocha --recursive --require ./tools/null-compiler --require babel-core/register",
 */
/* istanbul ignore next */
require.extensions[".scss"] = function() {
  return null;
};
/* istanbul ignore next */
require.extensions[".svg"] = function() {
  return null;
};
/* istanbul ignore next */
require.extensions[".png"] = function() {
  return null;
};
/* istanbul ignore next */
require.extensions[".graphql"] = function() {
  return null;
};
