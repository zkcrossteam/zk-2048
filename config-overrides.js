const path = require("path");
const fs = require("fs");

module.exports = function override(config, env) {
  console.log(config);
  config.module.rules.forEach(rule => {
    (rule.oneOf || []).forEach(oneOf => {
      if (oneOf.test && oneOf.test.toString().indexOf('tsx') >= 0) {
        oneOf.include = [oneOf.include, fs.realpathSync(path.resolve(__dirname, 'node_modules/web3subscriber/', 'src'))]
      }
    })
  })

  const wasmExtensionRegExp = /\.wasm$/;
  config.resolve.extensions.push('.wasm');

  config.module.rules.forEach(rule => {
    (rule.oneOf || []).forEach(oneOf => {
      if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
        oneOf.exclude.push(wasmExtensionRegExp)
      }
    })
  })

  config.module.rules.push({
    test: wasmExtensionRegExp,
    include: path.resolve(__dirname, 'src'),
    type: "javascript/auto",
    use: [{ loader: 'wasm-loader'}]
    //use: [{ loader: 'file-loader'}]
  })



  return config
}
