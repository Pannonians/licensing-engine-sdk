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
import axios from 'axios';
import { camelToKebab } from '../util';
const error = {
    messages: {
        MISSING_TOKEN: 'If you are using token as an auth method, please provide an actual token as well',
    },
};
export const http = axios.create({
    baseURL: process.env.LICENSING_ENGINE_API_ORIGIN,
    withCredentials: true,
});
const methods = ['GET', 'POST', 'PUT', 'DELETE'];
export const createApi = (baseUrl, authMethod, token) => new Proxy({}, {
    get(_, property) {
        if (['GET', 'DELETE'].includes(property))
            return (params, _a = {}) => {
                var { transformUrl = (s) => s } = _a, config = __rest(_a, ["transformUrl"]);
                if (authMethod === 'token' && token === null) {
                    throw Error(error.messages.MISSING_TOKEN);
                }
                else {
                    http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
                // @ts-ignore
                return http[property.toLowerCase()](transformUrl(params
                    ? `${baseUrl}?${new URLSearchParams(params).toString()}`
                    : baseUrl), config);
            };
        if (['PUT', 'POST'].includes(property)) {
            if (authMethod === 'token' && token === null) {
                throw Error(error.messages.MISSING_TOKEN);
            }
            else {
                http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            return (body, config) => 
            // @ts-ignore
            http[property.toLowerCase()](baseUrl, body, config);
        }
        return createApi(`${baseUrl}/${property.includes('_') || property.match(/^[A-Z_0-9]*$/)
            ? property
            : camelToKebab(property)}`, authMethod, token);
    },
});
