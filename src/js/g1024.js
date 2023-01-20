import makeWasm from './g1024.wasm';
const {
    Module,
    instantiate,
    Memory,
    Table
} = WebAssembly;

var instance = null;

export default async function () {
  if (instance != null) {
    return instance.exports;
  } else {
    module = await makeWasm({
      'global': {},
      'env': {
        'memory': new Memory({ initial: 10, limit: 100 }),
        'table': new Table({ initial: 0, element: 'anyfunc' }),
        'abort': () => { console.err("abort in wasm!"); },
        'require': (b) => {if(!b){console.error("require failed");} },
        'wasm_input': (b) => {console.error("require failed")}
      }
    });
    console.log("module loaded", module);  // "3
    /*
    WebAssembly.instantiateStreaming(makeWasm, importObject).then(
        (obj) => console.log(obj.instance.exports)
    );
    */
    instance = module.instance;
    return instance.exports;
  }
}
