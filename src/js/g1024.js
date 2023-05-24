import makeWasm from './g1024.wasm';

const { Memory, Table } = WebAssembly;
let instance = null;

export default async function () {
  if (instance != null) {
    return instance.exports;
  } else {
    module = await makeWasm({
      global: {},
      env: {
        memory: new Memory({ initial: 10, limit: 100 }),
        table: new Table({ initial: 0, element: 'anyfunc' }),
        abort: () => {
          console.error('abort in wasm!');
          throw new Error('Unsupported wasm api: abort');
        },
        require: b => {
          if (!b) {
            console.error('require failed');
            throw new Error('Require failed');
          }
        },
        wasm_input: () => {
          console.error('wasm_input should not been called in non-zkwasm mode');
          throw new Error('Unsupported wasm api: wasm_input');
        },
      },
    });
    console.log('module loaded', module); // "3
    /*
    WebAssembly.instantiateStreaming(makeWasm, importObject).then(
        (obj) => console.log(obj.instance.exports)
    );
    */
    instance = module.instance;
    return instance.exports;
  }
}
