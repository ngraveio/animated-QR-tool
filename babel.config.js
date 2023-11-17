module.exports = function (api) {
  api.cache(true);
  const result = {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@hooks": "./src/hooks",
            "@navigators": "./src/navigators",
            "https": require.resolve('https-browserify'),
            "zlib": require.resolve('browserify-zlib'),
          },
        },
      ],
    ], 
  };
  console.log('Babel config', JSON.stringify(result, null, 2));
  return result;
};
