global.TextEncoder = class {
    encode(str) {
      const buf = new ArrayBuffer(str.length * 2);
      const bufView = new Uint16Array(buf);
      for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return { buffer: buf };
    }
  };