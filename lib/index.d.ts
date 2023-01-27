import { AxiosRequestConfig, AxiosResponse } from 'axios';
type RequestOptions = AxiosRequestConfig & {
    transformUrl?(url: string): string;
};
type Response<T> = AxiosResponse<T>;
type Get<Req, Res> = {
    GET: (req?: Req, options?: RequestOptions) => Promise<Response<Res>>;
};
export declare const createApi: <Api extends Record<string, any>>(baseUrl: string, authMethod: 'domain' | 'token', token?: string | null) => Api;
type GetLicensesApi = {
    '': Get<{}, string[]>;
};
/**
 * Represents an licensing engine SDK.
 * @param {('domain'|'token')} authMethod - Method. Can be "domain" or "token".
 * @param {string} token - Bearer token. Required if authMethod is "token".
 * @returns {Promise} - Returns an async axios response
 */
export declare const licensingEngineApi: (authMethod: 'domain' | 'token', token?: null) => {
    getLicenses: GetLicensesApi;
};
export {};
