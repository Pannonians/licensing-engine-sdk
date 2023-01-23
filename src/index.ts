import * as dotenv from 'dotenv'
import { GetLicensesApi } from './api/GetLicenses'
import { createApi } from './http'
dotenv.config()

export const licensingEngineApi = (authMethod: 'domain' | 'token', token = null) =>
  createApi<{
    getLicenses: GetLicensesApi
  }>(`${process.env.LICENSING_ENGINE_API_ORIGIN}`, authMethod, token)
