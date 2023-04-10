import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
const camelToKebab = (str: string) => str?.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const error = {
  messages: {
    MISSING_TOKEN: 'If you are using token as an auth method, please provide an actual token as well',
  },
};

const http = axios.create({
  baseURL: process.env.LICENSING_ENGINE_API_ORIGIN || process.env.VUE_APP_LICENSING_ENGINE_API_ORIGIN,
  withCredentials: true,
});

type RequestOptions = AxiosRequestConfig & {
  transformUrl?(url: string): string;
};
type Response<T> = AxiosResponse<T>;

type Get<Req, Res> = {
  GET: (req?: Req, options?: RequestOptions) => Promise<Response<Res>>;
};
type Delete<Req = {}, Res = {}> = {
  DELETE: (req?: Req, options?: RequestOptions) => Promise<Response<Res>>;
};
type Put<Req, Res = {}> = {
  PUT: (req: Req, options?: RequestOptions) => Promise<Response<Res>>;
};
type Post<Req, Res = {}> = {
  POST: (req: Req, options?: RequestOptions) => Promise<Response<Res>>;
};

const methods = ['GET', 'POST', 'PUT', 'DELETE'] as const;

export const createApi = <Api extends Record<string, any>>(
  baseUrl: string,
  authMethod: 'domain' | 'token',
  token?: string | null,
): Api =>
  new Proxy(
    {},
    {
      get(_, property: typeof methods[number]) {
        if (['GET', 'DELETE'].includes(property))
          return (
            params: string | string[][] | Record<string, string> | URLSearchParams | undefined,
            { transformUrl = (s: any) => s, ...config } = {},
          ) => {
            if (authMethod === 'token' && token === null) {
              throw Error(error.messages.MISSING_TOKEN);
            } else {
              if (authMethod === 'token') {
                http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              } else {
                delete http.defaults.headers.common['Authorization']
              }
            }
            // @ts-ignore
            return http[property.toLowerCase()](
              transformUrl(params ? `${baseUrl}?${new URLSearchParams(params).toString()}` : baseUrl),
              config,
            );
          };
        if (['PUT', 'POST'].includes(property)) {
          if (authMethod === 'token' && token === null) {
            throw Error(error.messages.MISSING_TOKEN);
          } else {
            if (authMethod === 'token') {
              http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } else {
              delete http.defaults.headers.common['Authorization']
            }
          }
          return (body: any, config: any) =>
            // @ts-ignore
            http[property.toLowerCase()](baseUrl, body, config);
        }

        return createApi(
          `${baseUrl}/${property.includes('_') || property.match(/^[A-Z_0-9]*$/) ? property : camelToKebab(property)}`,
          authMethod,
          token,
        );
      },
    },
  ) as Api;

/* eslint-disable camelcase */
type GetLicensesApi = {
  '': Get<{}, string[]>;
};

/**
 * Represents an licensing engine SDK.
 * @param {('domain'|'token')} authMethod - Method. Can be "domain" or "token".
 * @param {string} token - Bearer token. Required if authMethod is "token".
 * @returns {Promise} - Returns an async axios response
 */
export const licensingEngineApi = (authMethod: 'domain' | 'token', token = null) =>
  createApi<{
    getLicenses: GetLicensesApi;
  }>(`${process.env.LICENSING_ENGINE_API_ORIGIN || process.env.VUE_APP_LICENSING_ENGINE_API_ORIGIN}`, authMethod, token);
