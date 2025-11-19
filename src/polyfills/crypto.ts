// Polyfill for crypto module in browser/web environment
// This is needed because expo-modules-core tries to use Node.js crypto module

if (typeof globalThis !== 'undefined') {
  if (!globalThis.crypto || typeof globalThis.crypto.randomUUID !== 'function') {
    globalThis.crypto = globalThis.crypto || {};
    
    // Polyfill getRandomValues if missing
    if (typeof globalThis.crypto.getRandomValues !== 'function') {
      globalThis.crypto.getRandomValues = function(arr) {
        if (!(arr instanceof Uint8Array || arr instanceof Uint16Array || arr instanceof Uint32Array || arr instanceof Int8Array || arr instanceof Int16Array || arr instanceof Int32Array || arr instanceof Float32Array || arr instanceof Float64Array)) {
          throw new TypeError('expected ArrayBufferView');
        }
        const buffer = new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
        for (let i = 0; i < buffer.length; i++) {
          buffer[i] = Math.floor(Math.random() * 256);
        }
        return arr;
      };
    }
    
    // Polyfill randomUUID
    if (typeof globalThis.crypto.randomUUID !== 'function') {
      globalThis.crypto.randomUUID = function(): `${string}-${string}-${string}-${string}-${string}` {
        const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        let uuid = '';
        for (let i = 0; i < template.length; i++) {
          const c = template[i];
          if (c === 'x') {
            const r = Math.floor(Math.random() * 16);
            uuid += r.toString(16);
          } else if (c === 'y') {
            const r = (Math.floor(Math.random() * 4)) + 8;
            uuid += r.toString(16);
          } else {
            uuid += c;
          }
        }
        return uuid as `${string}-${string}-${string}-${string}-${string}`;
      };
    }
  }
}

export {};
