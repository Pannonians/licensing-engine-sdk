import * as dotenv from 'dotenv'
import { GetLicensesApi } from './api/GetLicenses'
import { createApi } from './http'
dotenv.config()

/**
 * Represents an licensing engine SDK.
 * @param {('domain'|'token')} authMethod - Method. Can be "domain" or "token".
 * @param {string} token - Bearer token. Required if authMethod is "token".
 * @returns {Promise} - Returns an async axios response
 */
export const licensingEngineApi = (authMethod: 'domain' | 'token', token = null) =>
  createApi<{
    getLicenses: GetLicensesApi
  }>(`${process.env.LICENSING_ENGINE_API_ORIGIN}`, authMethod, token)
