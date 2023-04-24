module.exports = function (api) {
  // The next line is disabled due to the api.env() call below
  // See https://github.com/babel/babel/issues/10052 for more details
  //api.cache(false);

  const presets = [
    "@babel/preset-env",
    ["@babel/preset-react", {"runtime": "automatic"}],
    "@babel/preset-typescript"
  ]

  const plugins = [];
  const isJestTest = api.env('test');
  if (isJestTest) {
    // we will only want babel-plugin-transform-import-meta active when running the tests
    // See https://stackoverflow.com/a/70640363 for why
    plugins.push(["babel-plugin-transform-import-meta", { "module": "ES6" }])
  }

  return {
    presets,
    plugins
  };
}