export const camelToKebab = (str) => str === null || str === void 0 ? void 0 : str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
