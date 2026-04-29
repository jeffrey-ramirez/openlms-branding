"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dark = exports.light = exports.tokens = void 0;
const tokens_1 = require("./tokens");
Object.defineProperty(exports, "light", { enumerable: true, get: function () { return tokens_1.light; } });
Object.defineProperty(exports, "dark", { enumerable: true, get: function () { return tokens_1.dark; } });
class Tokens {
    constructor() {
        this.mode = "light";
    }
    setMode(mode) {
        this.mode = mode;
    }
    get(group, scale) {
        return this.mode === "dark"
            ? tokens_1.dark[group]?.[scale]
            : tokens_1.light[group]?.[scale];
    }
}
exports.tokens = new Tokens();
