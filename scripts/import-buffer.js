// We do this with an import so it is executed before node_modules are loaded.
// Otherwise the 'cbor-sync' package, a sub-dependency of '@ngraveio/bc-ur' will not be insantiated with the correct Buffer class.
if (typeof Buffer === "undefined") global.Buffer = require("buffer").Buffer;