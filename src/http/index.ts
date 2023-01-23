import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { camelToKebab } from '../util'

const error = {
  messages: {
    MISSING_TOKEN:
      'If you are using token as an auth method, please provide an actual token as well',
  },
}

export const http = axios.create({
  baseURL: process.env.LICENSING_ENGINE_API_ORIGIN,
  withCredentials: true,
})

export type RequestOptions = AxiosRequestConfig & {
  transformUrl?(url: string): string
}
export type Response<T> = AxiosResponse<T>

export type Get<Req, Res> = {
  GET: (req?: Req, options?: RequestOptions) => Promise<Response<Res>>
}
export type Delete<Req = {}, Res = {}> = {
  DELETE: (req?: Req, options?: RequestOptions) => Promise<Response<Res>>
}
export type Put<Req, Res = {}> = {
  PUT: (req: Req, options?: RequestOptions) => Promise<Response<Res>>
}
export type Post<Req, Res = {}> = {
  POST: (req: Req, options?: RequestOptions) => Promise<Response<Res>>
}

const methods = ['GET', 'POST', 'PUT', 'DELETE'] as const

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
            params:
              | string
              | string[][]
              | Record<string, string>
              | URLSearchParams
              | undefined,
            { transformUrl = (s: any) => s, ...config } = {},
          ) => {
            if (authMethod === 'token' && token === null) {
              throw Error(error.messages.MISSING_TOKEN)
            } else {
              http.defaults.headers.common['Authorization'] = `Bearer ${token}`
            }
            // @ts-ignore
            return http[property.toLowerCase()](
              transformUrl(
                params
                  ? `${baseUrl}?${new URLSearchParams(params).toString()}`
                  : baseUrl,
              ),
              config,
            )
          }
        if (['PUT', 'POST'].includes(property)) {
          if (authMethod === 'token' && token === null) {
            throw Error(error.messages.MISSING_TOKEN)
          } else {
            http.defaults.headers.common['Authorization'] = `Bearer ${token}`
          }
          return (body: any, config: any) =>
            // @ts-ignore
            http[property.toLowerCase()](baseUrl, body, config)
        }

        return createApi(
          `${baseUrl}/${
            property.includes('_') || property.match(/^[A-Z_0-9]*$/)
              ? property
              : camelToKebab(property)
          }`,
          authMethod,
          token,
        )
      },
    },
  ) as Api
