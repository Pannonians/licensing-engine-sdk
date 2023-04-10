"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.licensingEngineApi = exports.createApi = void 0;
const axios_1 = require("axios");
const camelToKebab = (str) => str === null || str === void 0 ? void 0 : str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const error = {
    messages: {
        MISSING_TOKEN: 'If you are using token as an auth method, please provide an actual token as well',
    },
};
const http = axios_1.default.create({
    baseURL: process.env.LICENSING_ENGINE_API_ORIGIN || process.env.VUE_APP_LICENSING_ENGINE_API_ORIGIN,
    withCredentials: true,
});
const methods = ['GET', 'POST', 'PUT', 'DELETE'];
const createApi = (baseUrl, authMethod, token) => new Proxy({}, {
    get(_, property) {
        if (['GET', 'DELETE'].includes(property))
            return (params, _a = {}) => {
                var { transformUrl = (s) => s } = _a, config = __rest(_a, ["transformUrl"]);
                if (authMethod === 'token' && token === null) {
                    throw Error(error.messages.MISSING_TOKEN);
                }
                else {
                    if (authMethod === 'token') {
                        http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    }
                    else {
                        delete http.defaults.headers.common['Authorization'];
                    }
                }
                // @ts-ignore
                return http[property.toLowerCase()](transformUrl(params ? `${baseUrl}?${new URLSearchParams(params).toString()}` : baseUrl), config);
            };
        if (['PUT', 'POST'].includes(property)) {
            if (authMethod === 'token' && token === null) {
                throw Error(error.messages.MISSING_TOKEN);
            }
            else {
                if (authMethod === 'token') {
                    http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
                else {
                    delete http.defaults.headers.common['Authorization'];
                }
            }
            return (body, config) => 
            // @ts-ignore
            http[property.toLowerCase()](baseUrl, body, config);
        }
        return (0, exports.createApi)(`${baseUrl}/${property.includes('_') || property.match(/^[A-Z_0-9]*$/) ? property : camelToKebab(property)}`, authMethod, token);
    },
});
exports.createApi = createApi;
/**
 * Represents an licensing engine SDK.
 * @param {('domain'|'token')} authMethod - Method. Can be "domain" or "token".
 * @param {string} token - Bearer token. Required if authMethod is "token".
 * @returns {Promise} - Returns an async axios response
 */
const licensingEngineApi = (authMethod, token = null) => (0, exports.createApi)(`${process.env.LICENSING_ENGINE_API_ORIGIN || process.env.VUE_APP_LICENSING_ENGINE_API_ORIGIN}`, authMethod, token);
exports.licensingEngineApi = licensingEngineApi;
