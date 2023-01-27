(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.camelToKebab = void 0;
    const camelToKebab = (str) => str === null || str === void 0 ? void 0 : str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
    exports.camelToKebab = camelToKebab;
});
